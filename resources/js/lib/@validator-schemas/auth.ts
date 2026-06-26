import { type } from "arktype";

export const LoginSchema = type({
    email: 'string.email',
    password: 'string >= 6',
})

export const RegisterSchema = LoginSchema.merge({
    name: 'string >= 2',
    password_confirmation: 'string',
}).narrow((obj, c) => {
    if (obj.password_confirmation == obj.password) {
        return true
    }

    return c.reject({
        expected: "identical to password",
        path: ["password_confirmation"]
    })
});
