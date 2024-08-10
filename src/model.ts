export type In = {
  name: string;
  qty: any;
  note: string | null;
};

export type Recipe = {
  name: string;
  ingredients: In[];
  serves: number;
  instructions: string;
  images: string[];
};
