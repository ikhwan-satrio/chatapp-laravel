<script lang="ts">
    import { createForm, Field } from '@tanstack/svelte-form';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { RegisterSchema } from '@/lib/@validator-schemas/auth';
    import { router,page } from '@inertiajs/svelte';

    const form = createForm(() => ({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
        validators: {
            onChange: RegisterSchema,
            onSubmit: RegisterSchema,
        },
        onSubmit: ({ value }) => {
            router.post('/auth/register', {
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
    <Field {form} name="name">
        {#snippet children(api)}
            <div class="grid gap-2">
                <Label for="reg-name">Name</Label>
                <Input
                    id="reg-name"
                    type="text"
                    placeholder="John Doe"
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
    <Field {form} name="email">
        {#snippet children(api)}
            <div class="grid gap-2">
                <Label for="reg-email">Email</Label>
                <Input
                    id="reg-email"
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
                <Label for="reg-password">Password</Label>
                <Input
                    id="reg-password"
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
    <Field {form} name="password_confirmation">
        {#snippet children(api)}
            <div class="grid gap-2">
                <Label for="reg-password-confirm">Confirm Password</Label>
                <Input
                    id="reg-password-confirm"
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
    <Button type="submit" class="w-full">Create Account</Button>
</form>
