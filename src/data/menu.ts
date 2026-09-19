export interface MenuItem {
  name: string;
  price: string;
  description?: string;
}

export interface MenuSubgroup {
  title?: string;
  note?: string;
  items: MenuItem[];
}

export interface MenuCategoryData {
  id: string;
  title: string;
  subgroups: MenuSubgroup[];
}

export const menuCategories: MenuCategoryData[] = [
  {
    id: "caffetteria",
    title: "Caffetteria",
    subgroups: [
      {
        items: [
          { name: "Caffè espresso", price: "1.10€" },
          { name: "Caffè corretto", price: "1.30€", description: "Con Baileys 1.50€" },
          { name: "Caffè macchiato", price: "1.20€" },
          { name: "Caffè macchiato (senza lattosio o soia)", price: "1.30€" },
          { name: "Crema caffè", price: "2.50€" },
          { name: "Caffè americano", price: "2.00€" },
          { name: "Caffè alla nocciola", price: "1.30€" },
          { name: "Caffè decaffeinato", price: "1.10€" },
          { name: "Caffè deca macchiato", price: "1.20€" },
          { name: "Orzo", price: "1.10€" },
          { name: "Orzo macchiato", price: "1.20€" },
          { name: "Orzo doppio", price: "2.40€" },
          { name: "Ginseng amaro", price: "1.50€" },
          { name: "Ginseng doppio", price: "3.00€" },
          { name: "Ginseng dolce", price: "1.50€" },
          { name: "Ginseng rosso", price: "1.50€" },
          { name: "Ginseng alla nocciola", price: "1.50€" },
          { name: "Ginseng miele e limone", price: "1.50€" },
          { name: "Cappuccino", price: "1.70€" },
          { name: "Cappuccino deca", price: "1.80€" },
          { name: "Cappuccino senza lattosio", price: "1.80€" },
          { name: "Cappuccino ginseng", price: "2.00€" },
          { name: "Cappuccino d'orzo", price: "2.00€" },
          { name: "Cappuccino nutella", price: "2.20€" },
          {
            name: "Cornetti Tre Marie",
            price: "1.30€",
            description:
              "Cioccolato, crema, pistacchio, frutti di bosco, albicocca, integrale al miele, vuoto, vegano ribes e melograno",
          },
          {
            name: "Cornetti Tre Marie",
            price: "1.50€",
            description:
              "Treccia noci e miele, conchiglia panna, latte e amarena, stracciatella, fagottina tiramisù",
          },
          { name: "Cornetto Nutella", price: "1.50€" },
          { name: "Polacca Aversana Crema e Amarena", price: "1.50€" },
          { name: "Ciambella zuccherata", price: "2.00€" },
          { name: "Ciambella con nutella", price: "2.50€" },
          { name: "Donuts", price: "1.50€", description: "Vari gusti" },
          {
            name: "Succhi di frutta",
            price: "2.00€ / 2.50€",
            description:
              "ACE, albicocca, pesca, arancia di Sicilia, arancia rossa, pera, banana, fragola, melograno, mirtillo, mela, ananas, ananas e cocco, pesca e mango, ananas senza zucchero",
          },
          { name: "Spremuta d'arancia", price: "2.50€" },
          { name: "Tè caldo", price: "2.50€" },
          { name: "Cioccolata calda", price: "2.50€" },
          { name: "Granita", price: "2.50€", description: "Vari gusti" },
        ],
      },
    ],
  },
  {
    id: "bibite",
    title: "Bibite",
    subgroups: [
      {
        items: [
          { name: "Crodino classico XL", price: "2.50€" },
          { name: "Crodino rosso XL", price: "2.50€" },
          { name: "Schweppes", price: "2.50€", description: "Arancia, limone, tonica" },
          { name: "Chinotto", price: "2.50€" },
          { name: "Bitter", price: "2.00€", description: "Bianco, rosso" },
          { name: "Cocktail San Pellegrino", price: "2.00€", description: "Bianco, rosso" },
          {
            name: "San Pellegrino Fruit",
            price: "2.50€",
            description: "Arancia e fico d'India, pompelmo, passion fruit",
          },
          { name: "Tassoni", price: "2.50€", description: "Classica, zero" },
          { name: "Tassoni Tonica Zero", price: "2.50€" },
          { name: "Tassoni pompelmo rosa", price: "2.50€" },
          { name: "Coca-Cola lattina", price: "2.00€" },
          { name: "Coca-Cola Zero lattina", price: "2.00€" },
          { name: "Pepsi lattina", price: "2.00€", description: "Classica, lime zero e limone" },
          { name: "Sprite lattina", price: "2.00€" },
          { name: "Coca-Cola bottiglia PET", price: "2.50€", description: "Classica, zero" },
          { name: "Coca-Cola vetro", price: "3.00€", description: "Classica, zero" },
          { name: "Estathè lattina", price: "2.00€", description: "Pesca, limone" },
          { name: "Estathè bottiglia", price: "2.50€", description: "Pesca, limone, zero" },
          { name: "Estathè vetro", price: "3.00€", description: "Pesca, limone" },
          { name: "Estathè deteinato", price: "2.00€", description: "Pesca, limone" },
          { name: "Estathè brick", price: "1.20€" },
          {
            name: "Redbull",
            price: "3.00€",
            description: "Classica, zero, lime, peach, vaniglia, cocco",
          },
          { name: "Aloe Vera", price: "2.50€", description: "Classica, melograno, ananas" },
        ],
      },
    ],
  },
  {
    id: "drink-list",
    title: "Drink List",
    subgroups: [
      {
        title: "Spritz",
        items: [
          { name: "Spritz Aperol", price: "5€" },
          { name: "Spritz Campari", price: "5€" },
          { name: "Spritz Hugo", price: "5€" },
          { name: "Spritz Cynar", price: "5€" },
          { name: "Spritz Limoncello", price: "5€" },
          { name: "Spritz Sarti Rosa", price: "5€" },
          { name: "Spritz Select", price: "5€" },
          { name: "Spritz Rabarbaro", price: "5€" },
          { name: "Spritz Violette", price: "5€" },
          { name: "Spritz Tropical", price: "5€" },
        ],
      },
      {
        title: "Classici",
        items: [
          { name: "Negroni", price: "7€" },
          { name: "Mi-To", price: "7€" },
          { name: "Negroni sbagliato", price: "7€", description: "Base Gin Mare" },
          { name: "Americano", price: "7€" },
          { name: "Moscow Mule", price: "7€" },
          { name: "Malibu Sunrise", price: "7€" },
          { name: "Paloma", price: "7€" },
          { name: "Piña Colada", price: "7€" },
        ],
      },
      {
        title: "Gin Tonic / Lemon",
        items: [
          { name: "Gin Mare", price: "8€" },
          { name: "Bulldog", price: "8€" },
          { name: "Malfy", price: "8€" },
          { name: "Bombay", price: "7€" },
          { name: "Tanquerai", price: "7€" },
          { name: "Bickens", price: "7€" },
        ],
      },
      {
        title: "Signature Tonic",
        items: [
          { name: "Velvet Berry Tonic", price: "10€", description: "Base Brockmans Gin" },
          { name: "Garden Royal Tonic", price: "10€", description: "Base Hendrick's Gin" },
          { name: "Riviera Prestige Tonic", price: "10€", description: "Base Portofino Gin" },
          { name: "Japanese Blossom Tonic", price: "10€", description: "Base Etsu Gin" },
        ],
      },
    ],
  },
  {
    id: "birre-e-liquori",
    title: "Birre e Liquori",
    subgroups: [
      {
        title: "Birre in bottiglia",
        items: [
          { name: "Ceres Strong Ale", price: "3.50€" },
          { name: "Nastro Azzurro", price: "2.00€" },
          { name: "Heineken", price: "2.50€" },
          { name: "Peroni Limone", price: "2.00€" },
          { name: "Poretti senza Glutine", price: "3.00€" },
          { name: "Poretti 0.0", price: "3.00€" },
          { name: "Forst", price: "3.00€" },
          { name: "Forst Citrus 0.0", price: "3.00€" },
          { name: "Corona", price: "3.00€" },
          { name: "Beck's", price: "2.50€" },
          { name: "Bud", price: "2.50€" },
          { name: "Ichnusa", price: "3.00€" },
          { name: "Tennent's", price: "4.00€" },
          { name: "Tuborg", price: "2.00€" },
          { name: "Tuborg Limone 0.0", price: "2.00€" },
          { name: "Stella Artois", price: "3.00€" },
          { name: "Raffo", price: "3.00€" },
          { name: "IGEA (Senza Glutine)", price: "3.50€" },
        ],
      },
      {
        title: "Alla spina",
        items: [
          { name: "Spina 0.3L", price: "3.00€" },
          { name: "Spina 0.5L", price: "5.00€" },
        ],
      },
      {
        title: "Liquori",
        items: [
          { name: "Amaro del Capo", price: "3.00€" },
          { name: "Averna", price: "3.00€" },
          { name: "Baileys", price: "3.00€" },
          { name: "Branca Menta", price: "3.00€" },
          { name: "Cynar", price: "3.00€" },
          { name: "Cognac", price: "3.00€" },
          { name: "Fernet", price: "3.00€" },
          { name: "Grappa Barrique", price: "3.00€" },
          { name: "Grappa Bianca", price: "3.00€" },
          { name: "Orzo macchiato", price: "3.00€" },
          {
            name: "Jack Daniel's",
            price: "3.00€",
            description: "Black Berry, Apple, Tennessee, Tennessee Fire, Tennessee Honey",
          },
          { name: "Jefferson", price: "3.50€" },
          { name: "Jägermeister", price: "3.00€" },
          { name: "Limoncello", price: "3.00€" },
          { name: "Martini", price: "3.00€" },
          { name: "Meloncello", price: "3.00€" },
          { name: "Montenegro", price: "3.00€" },
          { name: "Petrus", price: "3.00€" },
          { name: "Punch", price: "3.00€" },
          { name: "Rum", price: "3.00€" },
          { name: "Rum Barceló", price: "3.00€" },
          { name: "Sambuca", price: "3.00€" },
          { name: "Strega", price: "3.00€" },
          { name: "Tequila", price: "3.00€" },
          { name: "Unicum", price: "3.00€" },
          { name: "Vecchia Romagna", price: "3.00€" },
          {
            name: "Vodka",
            price: "3.00€",
            description: "Fragola, melone, pesca, ginseng e guarana",
          },
        ],
      },
    ],
  },
  {
    id: "wine-selection",
    title: "Wine Selection",
    subgroups: [
      {
        items: [
          {
            name: "Traminer Aromatico",
            price: "18€",
            description: "I Magredi — Friuli-Venezia Giulia — 100% Traminer Aromatico",
          },
          {
            name: "Pallagrè Bianco",
            price: "18€ (bottiglia) / 5€ (calice)",
            description: "Quercete — Campania — 100% Pallagrello Bianco",
          },
          {
            name: "Bourgogne AOC Chardonnay",
            price: "22€",
            description: "Reine Pédauque — Francia — 100% Chardonnay",
          },
          {
            name: "Bullorosso Campania IGP",
            price: "20€",
            description: "Vitialte — Campania — 70% Aglianico, 30% Montepulciano",
          },
          {
            name: "Bourgogne Pinot Noir AOP",
            price: "22€",
            description: "Reine Pédauque — Francia — 100% Pinot Noir",
          },
          {
            name: "Gelso Nero Puglia IGT",
            price: "20€",
            description: "Podere 29 — Puglia — 100% Nero di Troia",
          },
          {
            name: "Petali IGT Toscano Rosato",
            price: "20€",
            description: "Cantalici — Toscana — 100% Sangiovese",
          },
          {
            name: "Elena Walch Chardonnay Alto Adige DOC",
            price: "28€ (bottiglia) / 5€ (calice)",
            description: "Elena Walch — Alto Adige — 100% Chardonnay",
          },
          {
            name: "Pitars Venezia Giulia Ribolla Gialla",
            price: "18€ (bottiglia) / 5€ (calice)",
            description: "Pitars — Friuli-Venezia Giulia — 100% Ribolla Gialla",
          },
          {
            name: "Serena Cabernet Veneto IGT",
            price: "18€ (bottiglia) / 5€ (calice)",
            description: "Serena — Veneto — 100% Cabernet",
          },
          {
            name: "Bertani Valpolicella Valpantena",
            price: "18€ (bottiglia) / 5€ (calice)",
            description: "Bertani — Veneto — 80% Corvina Veronese, 20% Rondinella",
          },
        ],
      },
    ],
  },
  {
    id: "spumanti-e-champagne",
    title: "Spumanti e Champagne",
    subgroups: [
      {
        items: [
          {
            name: "Ferrari Maximum Blanc de Blancs",
            price: "35€",
            description: "Ferrari — Trentino — 100% Chardonnay",
          },
          {
            name: "Prosecco Serena DOC Treviso",
            price: "25€",
            description: "Serena — Veneto — 85% Glera",
          },
          {
            name: "Moët & Chandon Champagne Réserve Impériale",
            price: "85€",
            description:
              "Moët & Chandon — Francia — 40% Pinot Noir, 30% Pinot Meunier, 30% Chardonnay",
          },
        ],
      },
    ],
  },
  {
    id: "gelati",
    title: "Gelati e Frappè",
    subgroups: [
      {
        note:
          "Gusti: Limone, Fragola, Panna, Nocciola, Cioccolato fondente, Pistacchio, Caffè, Stracciatella, Fiordilatte, Tiramisù",
        items: [
          { name: "Cono (2 gusti)", price: "2.50€" },
          { name: "Coppa (2 gusti)", price: "2.50€" },
          { name: "Cono (3 gusti)", price: "3.50€" },
          { name: "Coppa (3 gusti)", price: "3.50€" },
          {
            name: "Frappè",
            price: "3.50€",
            description: "Melone, limone, pesca, mango, passion fruit, fragola",
          },
        ],
      },
    ],
  },
];
