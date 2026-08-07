"use client";

import { useEffect, useRef, useState, type FormEvent, type WheelEvent } from "react";
import { toast } from "sonner";
import { ChevronLeftIcon, ChevronRightIcon, MessageCircleIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";
import {
  CHAT_TOPICS,
  matchTopic,
  matchSmallTalk,
  isLikelyJobSpecificQuestion,
  isReportIntent,
} from "@/lib/support-chatbot";
import { submitSupportRequestAction } from "@/lib/actions/support-request";

export const SUPPORT_CHAT_OPEN_EVENT = "support-chat:open";

export function openSupportChat() {
  window.dispatchEvent(new CustomEvent(SUPPORT_CHAT_OPEN_EVENT));
}

const REPORT_ACTION_ID = "__report__";

interface QuickReply {
  label: string;
  value: string;
}

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
  quickReplies?: QuickReply[];
}

type Mode = "idle" | "reporting-description" | "reporting-name" | "reporting-email" | "reporting-confirm";

interface DraftReport {
  description: string;
  name: string;
  email: string;
}

function topicQuickReplies(): QuickReply[] {
  return [
    ...CHAT_TOPICS.map((t) => ({ label: t.shortLabel, value: t.id })),
    { label: "Reportar problema", value: REPORT_ACTION_ID },
  ];
}

function deriveSubject(description: string): string {
  const firstLine = description.split("\n")[0]?.trim() || description.trim();
  if (!firstLine) return "Reporte desde el chat de soporte";
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}...` : firstLine;
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

function QuickReplyRow({
  replies,
  onSelect,
}: {
  replies: QuickReply[];
  onSelect: (value: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    // Mouse wheels only emit vertical delta — redirect it to horizontal scroll
    // so the strip is scrollable without a trackpad or a visible scrollbar.
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      el.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }

  return (
    <div className="relative -mx-1 flex items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 rounded-full"
        aria-label="Ver temas anteriores"
        onClick={() => scrollByAmount(-120)}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div
        ref={scrollerRef}
        onWheel={handleWheel}
        className="flex flex-1 gap-1.5 overflow-x-auto scroll-smooth px-1 py-0.5 [-webkit-mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {replies.map((reply) => (
          <Button
            key={reply.value}
            type="button"
            variant="outline"
            size="sm"
            className="h-auto shrink-0 whitespace-nowrap rounded-full py-1 text-xs"
            onClick={() => onSelect(reply.value)}
          >
            {reply.label}
          </Button>
        ))}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="shrink-0 rounded-full"
        aria-label="Ver más temas"
        onClick={() => scrollByAmount(120)}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}

function initialMessages(): ChatMessage[] {
  return [
    {
      id: nextId(),
      from: "bot",
      text: "¡Hola! ¿En qué puedo ayudarte?",
      quickReplies: topicQuickReplies(),
    },
  ];
}

export function SupportChatWidget({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("idle");
  const [draft, setDraft] = useState<DraftReport>({
    description: "",
    name: initialName,
    email: initialEmail,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    window.addEventListener(SUPPORT_CHAT_OPEN_EVENT, handleOpenEvent);
    return () => window.removeEventListener(SUPPORT_CHAT_OPEN_EVENT, handleOpenEvent);
  }, []);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function pushBot(text: string, quickReplies?: QuickReply[]) {
    setMessages((prev) => [...prev, { id: nextId(), from: "bot", text, quickReplies }]);
  }

  function pushUser(text: string) {
    setMessages((prev) => [...prev, { id: nextId(), from: "user", text }]);
  }

  function startReportFlow() {
    setMode("reporting-description");
    pushBot(
      "Cuéntame qué problema tuviste. Sé lo más específico posible: qué intentabas hacer, qué esperabas que pasara y qué ocurrió en su lugar."
    );
  }

  function handleQuickReply(value: string) {
    if (value === REPORT_ACTION_ID) {
      pushUser("Reportar un problema técnico");
      startReportFlow();
      return;
    }
    const topic = CHAT_TOPICS.find((t) => t.id === value);
    if (!topic) return;
    pushUser(topic.label);
    pushBot(topic.answer, topicQuickReplies());
  }

  async function submitReport(finalDraft: DraftReport) {
    setIsSubmitting(true);
    const result = await submitSupportRequestAction({
      name: finalDraft.name,
      email: finalDraft.email,
      subject: deriveSubject(finalDraft.description),
      message: finalDraft.description,
    });
    setIsSubmitting(false);

    if (!result.success) {
      pushBot(`No pude enviar tu reporte: ${result.error}`);
      return;
    }
    toast.success("Reporte enviado");
    pushBot("¡Listo! Registré tu reporte y nuestro equipo lo revisará pronto. ¿Necesitas algo más?", topicQuickReplies());
    setMode("idle");
    setDraft({ description: "", name: initialName, email: initialEmail });
  }

  function handleConfirmReport() {
    pushUser("Confirmar y enviar");
    void submitReport(draft);
  }

  function handleCancelReport() {
    pushUser("Cancelar");
    setMode("idle");
    setDraft({ description: "", name: initialName, email: initialEmail });
    pushBot("Reporte cancelado. ¿Necesitas algo más?", topicQuickReplies());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    pushUser(text);

    if (mode === "reporting-description") {
      setDraft((d) => ({ ...d, description: text }));
      if (draft.name && draft.email) {
        setMode("reporting-confirm");
        pushBot(
          `Voy a registrar este reporte:\n\nAsunto: ${deriveSubject(text)}\nDescripción: ${text}\n\n¿Confirmas que quieres enviarlo?`
        );
      } else if (!draft.name) {
        setMode("reporting-name");
        pushBot("¿Cuál es tu nombre?");
      } else {
        setMode("reporting-email");
        pushBot("¿Cuál es tu correo electrónico? Lo usaremos para darte seguimiento.");
      }
      return;
    }

    if (mode === "reporting-name") {
      setDraft((d) => ({ ...d, name: text }));
      if (draft.email) {
        setMode("reporting-confirm");
        pushBot(
          `Voy a registrar este reporte:\n\nAsunto: ${deriveSubject(draft.description)}\nDescripción: ${draft.description}\nNombre: ${text}\nCorreo: ${draft.email}\n\n¿Confirmas que quieres enviarlo?`
        );
      } else {
        setMode("reporting-email");
        pushBot("¿Cuál es tu correo electrónico? Lo usaremos para darte seguimiento.");
      }
      return;
    }

    if (mode === "reporting-email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(text)) {
        pushBot("Ese correo no parece válido. ¿Puedes escribirlo de nuevo?");
        return;
      }
      const finalDraft = { ...draft, email: text };
      setDraft(finalDraft);
      setMode("reporting-confirm");
      pushBot(
        `Voy a registrar este reporte:\n\nAsunto: ${deriveSubject(finalDraft.description)}\nDescripción: ${finalDraft.description}\nNombre: ${finalDraft.name}\nCorreo: ${finalDraft.email}\n\n¿Confirmas que quieres enviarlo?`
      );
      return;
    }

    if (isLikelyJobSpecificQuestion(text)) {
      pushBot(
        "No puedo darte información específica sobre una vacante en particular. Revisa los detalles directamente en la página de la oferta, o contacta a la empresa a través de tu postulación.",
        topicQuickReplies()
      );
      return;
    }

    const topic = matchTopic(text);
    if (topic) {
      pushBot(topic.answer, topicQuickReplies());
      return;
    }

    const smallTalk = matchSmallTalk(text);
    if (smallTalk) {
      pushBot(smallTalk, topicQuickReplies());
      return;
    }

    if (isReportIntent(text)) {
      startReportFlow();
      return;
    }

    pushBot(
      "No estoy seguro de haber entendido. Puedes elegir uno de estos temas, o pedirme que registre un reporte técnico.",
      topicQuickReplies()
    );
  }

  return (
    <div className="fixed right-5 bottom-5 z-40">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              size="icon-lg"
              className="rounded-full shadow-lg"
              aria-label="Abrir chat de soporte"
            />
          }
        >
          <MessageCircleIcon className="size-5" />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={12}
          positionMethod="fixed"
          className="flex h-[30rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden p-0 sm:w-96"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Soporte</p>
            <PopoverClose
              render={<Button variant="ghost" size="icon-sm" aria-label="Cerrar chat" />}
            >
              <XIcon className="size-4" />
            </PopoverClose>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-2">
                <div
                  className={
                    message.from === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm whitespace-pre-wrap text-primary-foreground"
                      : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm whitespace-pre-wrap text-foreground"
                  }
                >
                  {message.text}
                </div>
                {message.quickReplies && (
                  <QuickReplyRow replies={message.quickReplies} onSelect={handleQuickReply} />
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3">
            {mode === "reporting-confirm" ? (
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={handleConfirmReport} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Confirmar y enviar"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={handleCancelReport} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  autoComplete="off"
                  className="h-9"
                />
                <Button type="submit" size="sm" disabled={!input.trim()}>
                  Enviar
                </Button>
              </form>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
