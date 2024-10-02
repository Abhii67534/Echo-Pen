
import { BlogObject } from '@/pages/BlogCard';
import { Quote } from '@/pages/Signin';
import { atom } from 'recoil';

export const quoteState = atom<Quote | null>({
    key: "quoteState",
    default: null
})

export const emailState = atom<string>({
    key: "emailState",
    default: ""
})

export const usernameState = atom<string>({
    key: "usernameState",
    default: ""
})

export const passwordState = atom<string>({
    key: "passwordState",
    default: ""
})

export const titleState = atom<string>({
    key: "titleState",
    default: ""
})

export const descState = atom<string>({
    key: "descState",
    default: ""
})


export const tokenState = atom<string>({
    key: "tokenState",
    default: ""
})

export const blogs = atom<Array<BlogObject>>({
    key: "blogs",
    default: []
})
