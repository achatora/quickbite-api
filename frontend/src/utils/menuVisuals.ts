import featuredBurgerFries from "../assets/images/featured/featured-burger-fries.jpg";
import signatureBurger from "../assets/images/burgers/signature-burger.jpg";
import spicyChickenSandwich from "../assets/images/chicken/spicy-chicken-sandwich.jpg";
import deepFriedOreos from "../assets/images/desserts/deep-fried-oreos.jpg";
import friedDessert from "../assets/images/desserts/fried-dessert.jpg";
import craftFountainSoda from "../assets/images/drinks/craft-fountain-soda.jpg";
import icedPeachTea from "../assets/images/drinks/iced-peach-tea.jpg";
import saltedCaramelMilkshake from "../assets/images/drinks/salted-caramel-milkshake.jpg";
import garlicParmesanFries from "../assets/images/fries/garlic-parmesan-fries.jpg";
import heroBurgerSalad from "../assets/images/hero/hero-burger-salad.jpg";
import chopHouseSalad from "../assets/images/salads/chop-house-salad.jpg";
import crispyOnionRings from "../assets/images/sides/crispy-onion-rings.jpg";
import type { MenuItem } from "../types";
import { getMenuItemImageUrl } from "./media";

export type MenuCategory =
  | "burgers"
  | "chicken"
  | "salads"
  | "fries"
  | "sides"
  | "desserts"
  | "drinks"
  | "featured";

export interface MenuVisual {
  alt: string;
  category: MenuCategory;
  imageUrl: string;
  isFallback: boolean;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function includesAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

export function getMenuCategory(item: MenuItem): MenuCategory {
  const content = normalize(`${item.name} ${item.description}`);

  if (includesAny(content, ["burger", "patty", "cheeseburger"])) {
    return "burgers";
  }

  if (includesAny(content, ["chicken sandwich", "fried chicken", "chicken"])) {
    return "chicken";
  }

  if (includesAny(content, ["salad", "romaine", "greens"])) {
    return "salads";
  }

  if (includesAny(content, ["fries", "potato"])) {
    return "fries";
  }

  if (includesAny(content, ["onion rings", "chips", "queso"])) {
    return "sides";
  }

  if (includesAny(content, ["oreo", "dessert", "sweet", "churro"])) {
    return "desserts";
  }

  if (includesAny(content, ["milkshake", "tea", "soda", "drink", "beverage"])) {
    return "drinks";
  }

  return "featured";
}

function getFallbackAsset(item: MenuItem): Omit<MenuVisual, "isFallback" | "imageUrl"> & { imageUrl: string } {
  const content = normalize(`${item.name} ${item.description}`);
  const category = getMenuCategory(item);

  if (includesAny(content, ["deep-fried oreos", "fried oreos"])) {
    return {
      alt: "Deep-fried Oreos dusted with powdered sugar and plated like a premium dessert.",
      category: "desserts",
      imageUrl: deepFriedOreos,
    };
  }

  if (includesAny(content, ["salted caramel milkshake"])) {
    return {
      alt: "A rich salted caramel milkshake served in a chilled glass with premium styling.",
      category: "drinks",
      imageUrl: saltedCaramelMilkshake,
    };
  }

  if (includesAny(content, ["iced sweet peach tea", "peach tea"])) {
    return {
      alt: "An iced sweet peach tea served cold in a glass with an editorial beverage presentation.",
      category: "drinks",
      imageUrl: icedPeachTea,
    };
  }

  if (includesAny(content, ["craft fountain soda", "fountain soda"])) {
    return {
      alt: "A chilled craft fountain soda poured over ice in a premium glass.",
      category: "drinks",
      imageUrl: craftFountainSoda,
    };
  }

  if (includesAny(content, ["milkshake", "caramel"])) {
    return {
      alt: "A decadent caramel milkshake topped for a premium dessert experience.",
      category: "drinks",
      imageUrl: saltedCaramelMilkshake,
    };
  }

  if (includesAny(content, ["tea", "soda", "peach"])) {
    return {
      alt: "An iced peach tea served cold with bright citrus and premium glassware.",
      category: "drinks",
      imageUrl: icedPeachTea,
    };
  }

  if (includesAny(content, ["oreo", "dessert", "sweet"])) {
    return {
      alt: "A warm fried dessert plated for a shareable finish.",
      category: "desserts",
      imageUrl: friedDessert,
    };
  }

  if (includesAny(content, ["onion rings", "chips", "queso"])) {
    return {
      alt: "Golden onion rings and sides styled with restaurant lighting.",
      category: "sides",
      imageUrl: crispyOnionRings,
    };
  }

  if (includesAny(content, ["fries"])) {
    return {
      alt: "A close-up of crisp fries with rich golden texture.",
      category: "fries",
      imageUrl: garlicParmesanFries,
    };
  }

  if (includesAny(content, ["salad", "greens"])) {
    return {
      alt: "A fresh composed salad photographed with natural editorial lighting.",
      category: "salads",
      imageUrl: chopHouseSalad,
    };
  }

  if (includesAny(content, ["chicken sandwich", "fried chicken", "chicken"])) {
    return {
      alt: "A crisp chicken sandwich plated with warm, premium styling.",
      category: "chicken",
      imageUrl: spicyChickenSandwich,
    };
  }

  if (includesAny(content, ["burger", "cheeseburger", "patty"])) {
    return {
      alt: "A gourmet burger stacked with fresh toppings and soft natural light.",
      category: "burgers",
      imageUrl: signatureBurger,
    };
  }

  return {
    alt: "A curated featured menu image styled like a premium fast-casual brand.",
    category,
    imageUrl: featuredBurgerFries,
  };
}

export function getMenuItemVisual(item: MenuItem): MenuVisual {
  const backendImageUrl = getMenuItemImageUrl(item);

  if (backendImageUrl) {
    return {
      alt: item.name,
      category: getMenuCategory(item),
      imageUrl: backendImageUrl,
      isFallback: false,
    };
  }

  const fallback = getFallbackAsset(item);

  return {
    ...fallback,
    isFallback: true,
  };
}

export const homeVisuals = {
  hero: heroBurgerSalad,
  featured: featuredBurgerFries,
  signatureBurger,
  chopHouseSalad,
  icedPeachTea,
};

export const categoryLabels: Record<MenuCategory, string> = {
  burgers: "Burgers",
  chicken: "Chicken",
  salads: "Salads",
  fries: "Fries",
  sides: "Sides",
  desserts: "Desserts",
  drinks: "Drinks",
  featured: "Featured",
};
