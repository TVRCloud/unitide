/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { Paperclip, Send, Smile } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { sendMessageSchema, TSendMessageInput } from "@/schemas/chats";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendMessage } from "@/hooks/useChats";
import { toast } from "sonner";

type Props = {
  chatId: string;
};

const MessageInput = ({ chatId }: Props) => {
  const sendMessage = useSendMessage(chatId);

  const form = useForm<TSendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      type: "text",
    },
  });

  const onSubmit = (data: any) => {
    sendMessage.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          // disabled={disabled}
          // onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                    // onKeyDown={handleKeyPress}
                    placeholder={"Type a message..."}
                    // disabled={disabled}
                    className="min-h-10 max-h-20 resize-none"
                    rows={1}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="button" variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>

        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
};

export default MessageInput;
