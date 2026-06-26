<script lang="ts">
    import AppHead from '@/components/AppHead.svelte';
    import {
        Tabs,
        TabsList,
        TabsTrigger,
        TabsContent,
    } from '@/components/ui/tabs';
    import {
        Card,
        CardHeader,
        CardTitle,
        CardDescription,
        CardContent,
    } from '@/components/ui/card';
    import LoginForm from '@/components/LoginForm.svelte';
    import RegisterForm from '@/components/RegisterForm.svelte';

    let tab = $state('register');
</script>

<AppHead title="Authentication" />

<div class="flex min-h-screen items-center justify-center p-6">
    <Card class="w-full max-w-md">
        <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
                Sign in to your account or create a new one
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs bind:value={tab}>
                <TabsList class="w-full">
                    <TabsTrigger value="login" class="flex-1">Login</TabsTrigger
                    >
                    <TabsTrigger value="register" class="flex-1"
                        >Register</TabsTrigger
                    >
                </TabsList>
                <TabsContent value="login" class="mt-6">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="register" class="mt-6">
                    <RegisterForm />
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
</div>
