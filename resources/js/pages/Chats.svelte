<script lang="ts">
    import { onDestroy, onMount, tick } from 'svelte';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { Avatar, AvatarFallback } from '@/components/ui/avatar';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Separator } from '@/components/ui/separator';
    import {
        Search,
        Users,
        MoreHorizontal,
        Paperclip,
        Smile,
        Send,
        Globe,
    } from '@lucide/svelte';
    import { router, page } from '@inertiajs/svelte';

    type Message = {
        id: string;
        user: {
            id: number;
            name: string;
            initials: string;
            color: string;
        };
        content: string;
        timestamp: Date;
        isOwn?: boolean;
    };

    type ChatRecord = {
        id: number;
        user_id: number;
        content: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    };

    const COLORS = [
        'bg-red-100 text-red-700',
        'bg-blue-100 text-blue-700',
        'bg-green-100 text-green-700',
        'bg-yellow-100 text-yellow-700',
        'bg-purple-100 text-purple-700',
        'bg-pink-100 text-pink-700',
        'bg-indigo-100 text-indigo-700',
        'bg-teal-100 text-teal-700',
    ];

    function getColor(userId: number): string {
        return COLORS[userId % COLORS.length];
    }

    function getInitials(name: string): string {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    function formatTime(date: Date): string {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function isSameUser(a: Message, b: Message): boolean {
        return a.user.name === b.user.name && a.isOwn === b.isOwn;
    }

    function shouldShowAvatar(index: number): boolean {
        if (index === 0) return true;
        return !isSameUser(messages[index], messages[index - 1]);
    }

    function shouldShowMeta(index: number): boolean {
        return shouldShowAvatar(index);
    }

    function mapMessage(chat: ChatRecord): Message {
        return {
            id: String(chat.id),
            user: {
                id: chat.user.id,
                name: chat.user.name,
                initials: getInitials(chat.user.name),
                color: getColor(chat.user.id),
            },
            content: chat.content,
            timestamp: new Date(chat.created_at),
            isOwn: chat.user_id === (page.props.auth?.user?.id ?? -1),
        };
    }

    let messageText = $state('');
    let messagesEl: HTMLDivElement | null = $state(null);
    let textareaEl: HTMLTextAreaElement | null = $state(null);
    let isTyping = $state(false);

    let { messages: rawMessages } = $props();

    let messages = $derived((rawMessages as ChatRecord[]).map(mapMessage));

    async function scrollToBottom() {
        await tick();
        messagesEl?.scrollTo({
            top: messagesEl.scrollHeight,
            behavior: 'smooth',
        });
    }

    async function sendMessage() {
        const content = messageText.trim();
        if (!content) return;

        messageText = '';
        resizeTextarea();

        router.post(
            '/chats',
            { message: content },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    scrollToBottom();
                },
            },
        );
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function resizeTextarea() {
        if (!textareaEl) return;
        textareaEl.style.height = 'auto';
        textareaEl.style.height = Math.min(textareaEl.scrollHeight, 120) + 'px';
    }

    onMount(() => scrollToBottom());
    onMount(() => {
        const channel = window.pusher.subscribe('global-chat');

        channel.bind('chat.sent', () => {
            router.reload({ only: ['messages'] });
        });
    });

    onDestroy(() => {
        window.pusher.unsubscribe('global-chat');
    });
</script>

<div class="flex h-screen flex-col bg-background">
    <header class="flex items-center gap-3 border-b px-4 py-3">
        <div
            class="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
        >
            <Globe class="h-4 w-4 text-muted-foreground" />
        </div>

        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium leading-none"># global</p>
            <p
                class="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"
            >
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-green-500"
                ></span>
                142 online
            </p>
        </div>

        <div class="flex items-center gap-1">
            <Button variant="ghost" size="icon" class="h-8 w-8">
                <Search class="h-4 w-4" />
                <span class="sr-only">Cari pesan</span>
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8">
                <Users class="h-4 w-4" />
                <span class="sr-only">Anggota</span>
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8">
                <MoreHorizontal class="h-4 w-4" />
                <span class="sr-only">Lainnya</span>
            </Button>
        </div>
    </header>

    <ScrollArea class="flex-1 px-4">
        <div bind:this={messagesEl} class="flex flex-col gap-0.5 py-4">
            <div class="my-3 flex items-center gap-3">
                <Separator class="flex-1" />
                <span class="text-xs text-muted-foreground">Hari ini</span>
                <Separator class="flex-1" />
            </div>

            {#each messages as msg, i (msg.id)}
                {@const showMeta = shouldShowMeta(i)}
                {@const showAvatar = shouldShowAvatar(i)}

                <div
                    class="flex items-end gap-2.5 px-1"
                    class:flex-row-reverse={msg.isOwn}
                    class:mt-3={showMeta && i !== 0}
                >
                    <div class="w-8 flex-shrink-0">
                        {#if showAvatar}
                            <Avatar class="h-8 w-8 text-xs">
                                <AvatarFallback class={msg.user.color}>
                                    {msg.user.initials}
                                </AvatarFallback>
                            </Avatar>
                        {/if}
                    </div>

                    <div
                        class="flex max-w-[68%] flex-col"
                        class:items-end={msg.isOwn}
                    >
                        {#if showMeta}
                            <div
                                class="mb-1 flex items-baseline gap-2"
                                class:flex-row-reverse={msg.isOwn}
                            >
                                <span class="text-xs font-medium"
                                    >{msg.user.name}</span
                                >
                                <span class="text-[10px] text-muted-foreground">
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                        {/if}

                        <div
                            class="rounded-2xl px-3 py-2 text-sm leading-relaxed"
                            class:bg-primary={msg.isOwn}
                            class:text-primary-foreground={msg.isOwn}
                            class:bg-muted={!msg.isOwn}
                            class:text-foreground={!msg.isOwn}
                        >
                            {msg.content}
                        </div>
                    </div>
                </div>
            {/each}

            {#if isTyping}
                <div class="mt-3 flex items-end gap-2.5 px-1">
                    <Avatar class="h-8 w-8 text-xs">
                        <AvatarFallback class="bg-amber-100 text-amber-700"
                            >DN</AvatarFallback
                        >
                    </Avatar>
                    <div class="rounded-2xl bg-muted px-3 py-2.5">
                        <div class="flex items-center gap-1">
                            <span
                                class="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                                style="animation-delay: 0ms"
                            ></span>
                            <span
                                class="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                                style="animation-delay: 150ms"
                            ></span>
                            <span
                                class="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                                style="animation-delay: 300ms"
                            ></span>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </ScrollArea>

    <div class="border-t px-4 py-3">
        <div
            class="flex items-end gap-2 rounded-xl border bg-background px-3 py-2
             focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0"
        >
            <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8 flex-shrink-0 text-muted-foreground"
            >
                <Paperclip class="h-4 w-4" />
                <span class="sr-only">Lampirkan file</span>
            </Button>

            <Textarea
                bind:ref={textareaEl}
                bind:value={messageText}
                onkeydown={handleKeydown}
                oninput={resizeTextarea}
                placeholder="Tulis pesan..."
                rows={1}
                class="max-h-[120px] flex-1 resize-none border-0 bg-transparent p-0 text-sm
               shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <div class="flex flex-shrink-0 items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 text-muted-foreground"
                >
                    <Smile class="h-4 w-4" />
                    <span class="sr-only">Emoji</span>
                </Button>
                <Button
                    size="icon"
                    class="h-8 w-8"
                    disabled={!messageText.trim()}
                    onclick={sendMessage}
                >
                    <Send class="h-4 w-4" />
                    <span class="sr-only">Kirim</span>
                </Button>
            </div>
        </div>

        <p class="mt-1.5 text-right text-[10px] text-muted-foreground">
            Enter kirim · Shift+Enter baris baru
        </p>
    </div>
</div>
