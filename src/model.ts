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

type Conversion = {
  price: {
    unit: {
      [key: string]: number;
    };
    rate: number;
  };
};

export type Grocery = {
  name: string;
  sec: string;
  selected: boolean;
};
