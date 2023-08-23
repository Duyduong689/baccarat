export class Card {
    code: string = "";
    value: string = "";
    image: string = "";
    images: object = {};
    suit: string = "";
}

export class Player {
    name: string = "";
    points: number = 0;
    coins: number = 5000;
    hand: any[] = [];
}
export type CardValue =
    | "ACE"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "JACK"
    | "QUEEN"
    | "KING";