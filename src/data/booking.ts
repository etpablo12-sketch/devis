import type { Manicurist } from "../types/models";

export const MANICURISTS: Manicurist[] = [
  {
    id: "1",
    name: "Camila Duarte",
    rating: "4.7",
    address: "Rua das Flores, 120 — Centro",
    price: "36,00",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    id: "2",
    name: "Larissa Mendes",
    rating: "4.9",
    address: "Av. Paulista, 800 — Jardins",
    price: "42,00",
    avatar: "https://i.pravatar.cc/120?img=45",
  },
  {
    id: "3",
    name: "Juliana Costa",
    rating: "4.8",
    address: "Rua Harmonia, 45 — Vila Madalena",
    price: "38,00",
    avatar: "https://i.pravatar.cc/120?img=32",
  },
];

export function getManicuristById(id: string): Manicurist | undefined {
  return MANICURISTS.find((m) => m.id === id);
}
