<script lang="ts">
    import { createForm, Field } from '@tanstack/svelte-form';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { LoginSchema } from '@/lib/@validator-schemas/auth';
    import { router, page } from '@inertiajs/svelte';

    const form = createForm(() => ({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onChange: LoginSchema,
            onSubmit: LoginSchema,
        },
        onSubmit: ({ value }) => {
            router.post('/auth/login', {
                _token: page.props.csrf_token,
                ...value,
            });
        },
    }));

    function handleSubmit(e: Event) {
        e.preventDefault();
        form.handleSubmit();
    }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
    <Field {form} name="email">
        {#snippet children(api)}
            <div class="grid gap-2">
                <Label for="login-email">Email</Label>
                <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={api.state.value}
                    oninput={(e) =>
                        api.handleChange((e.target as HTMLInputElement).value)}
                    onblur={() => api.handleBlur()}
                    aria-invalid={api.state.meta.errors.length > 0}
                />
                {#if api.state.meta.errors.length}
                    <p class="text-destructive text-[0.8rem] font-medium">
                        {api.state.meta.errors[0]?.message}
                    </p>
                {/if}
            </div>
        {/snippet}
    </Field>
    <Field {form} name="password">
        {#snippet children(api)}
            <div class="grid gap-2">
                <Label for="login-password">Password</Label>
                <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={api.state.value}
                    oninput={(e) =>
                        api.handleChange((e.target as HTMLInputElement).value)}
                    onblur={() => api.handleBlur()}
                    aria-invalid={api.state.meta.errors.length > 0}
                />
                {#if api.state.meta.errors.length}
                    <p class="text-destructive text-[0.8rem] font-medium">
                        {api.state.meta.errors[0]?.message}
                    </p>
                {/if}
            </div>
        {/snippet}
    </Field>
    <Button type="submit" class="w-full">Sign In</Button>
</form>
