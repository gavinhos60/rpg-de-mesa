import axios from "axios";
import type { Character } from "../types/Character";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

export async function getCharacters(): Promise<Character[]> {
    const response = await api.get<Character[]>("/characters");

    return response.data;
}

export async function getCharacterById(
    id: number
): Promise<Character> {
    const response = await api.get<Character>(`/characters/${id}`);

    return response.data;
}