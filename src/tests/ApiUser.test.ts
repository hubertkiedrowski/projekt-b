import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { ApiUser } from "../api/ApiUser.ts";
import { config } from "../main.ts";
import {
  assertExists,
  assertNotEquals,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";

Deno.test("login should set the authentication token", async () => {
  const apiHost = "https://preview.carely-app.de";
  const name = "testUser1";
  const user = new ApiUser(apiHost, name);

  const password = "XQ92V2v&";
  const timeout = 5000;

  try {
    await user.login(name, password, timeout);
    assertExists(user);
    const token = user.getToken();
    console.log("Token obtained: ", token);

    assertNotEquals(token, "", "The token should not be an empty string");
  } catch (error) {
    console.error("Error during login: ", error);
    assertNotEquals("", "2");
    throw error;
  }
});
const data = [
  { id: "06_basismodul.md", title: "Basismodul", slug: "basismodul" },
  {
    id: "07_modul_arbeitssicherheit_und_branschutz.md",
    title: "Arbeitssicherheit und Brandschutz",
    slug: "arbeitssicherheit-und-brandschutz",
  },
  {
    id: "08_modul_hygiene_covid19_gefahrenstoffe.md",
    title: "Hygiene, Covid-19, Gefahrstoffe",
    slug: "hygiene-covid-19-gefahrstoffe",
  },
  {
    id: "09_modul_beschwerdemanagement_und_datenschu.md",
    title: "Beschwerdemanagement und Datenschutz",
    slug: "beschwerdemanagement-und-datenschutz",
  },
  {
    id: "10_modul_este_hilfe.md",
    title: "Erste Hilfe",
    slug: "erste-hilfe",
    children: [
      {
        id: "10_modul_este_hilfe.md",
        title: "Lebensrettende Sofortmaßnahmen",
        slug: "lebensrettende-sofortmaßnahmen",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "So mache ich eine Herzdruckmassage:",
        slug: "so-mache-ich-eine-herzdruckmassage",
      },
      {
        id: "10_modul_este_hilfe.md",
        title:
          "So mache ich die Mund-zu-Mund-Beatmung bei der Herzdruckmassage:",
        slug: "so-mache-ich-die-mund-zu-mund-beatmung-bei-der-herzdruckmassage",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: 'So geht die "Stabile Seitenlage":',
        slug: "so-geht-die-stabile-seitenlage",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Wie prüfe ich die Vitalfunktionen?",
        slug: "wie-prüfe-ich-die-vitalfunktionen",
      },
      { id: "10_modul_este_hilfe.md", title: "Blutungen", slug: "blutungen" },
      {
        id: "10_modul_este_hilfe.md",
        title: "Verbrennungen und Verbrühungen",
        slug: "verbrennungen-und-verbrühungen",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Elektrounfälle oder Stromschlag",
        slug: "elektrounfälle-oder-stromschlag",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Erfrierungen",
        slug: "erfrierungen",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Unterkühlung",
        slug: "unterkühlung",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Verätzungen",
        slug: "verätzungen",
      },
      { id: "10_modul_este_hilfe.md", title: "Vergiftung", slug: "vergiftung" },
      {
        id: "10_modul_este_hilfe.md",
        title: "Wundversorgung",
        slug: "wundversorgung",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Knochenbrüche",
        slug: "knochenbrüche",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Schockzustand",
        slug: "schockzustand",
      },
      { id: "10_modul_este_hilfe.md", title: "Notruf 112", slug: "notruf-112" },
      {
        id: "10_modul_este_hilfe.md",
        title: "Prüfen des Blutdrucks",
        slug: "prüfen-des-blutdrucks",
      },
      { id: "10_modul_este_hilfe.md", title: "Schock", slug: "schock" },
      {
        id: "10_modul_este_hilfe.md",
        title: "Wundversorgung",
        slug: "wundversorgung",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Schädel-Hirn-Trauma (SHT)",
        slug: "schädel-hirn-trauma-sht",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Kardiopulmonale Reanimation",
        slug: "kardiopulmonale-reanimation",
      },
      {
        id: "10_modul_este_hilfe.md",
        title: "Verbandbuch und Verbandskasten",
        slug: "verbandbuch-und-verbandskasten",
      },
    ],
  },
  {
    id: "11_modul_expertenstandards.md",
    title: "Expertenstandards",
    slug: "expertenstandards",
  },
  { id: "12_modul_betreuung.md", title: "Betreuung", slug: "betreuung" },
  {
    id: "13_gewalt_in_der_pflege.md",
    title: "Gewalt in der Pflege",
    slug: "gewalt-in-der-pflege",
  },
];

Deno.test("get should fetch data from the API", async () => {
  const apiHost = "https://preview.carely-app.de";
  const name = "testUser1";
  const user = new ApiUser(apiHost, name);
  const password = "XQ92V2v&";
  const timeout = 5000;
  await user.login(name, password, timeout);

  const expectedData = { name: data };
  const mockResponse = new Response(JSON.stringify(expectedData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  globalThis.fetch = async () => mockResponse;

  const response = await user.get(
    "/wiki/WikiTableOfContent?Lang=de&Prefix=/wiki",
    timeout
  );

  const jsonResponse = await response.json();

  assertEquals(jsonResponse, expectedData);
});

const payload = {
  finished: null,
  answers_correct: true,
  explanation:
    "Elektrische Geräte müssen regelmäßig geprüft werden. \u003cb\u003eSpätestens nach 12 Monaten.\u003c/b\u003e",
  hint: "",
  count: 1,
};

// Deno.test("post should send data to the API", async () => {
//   const apiHost = "https://preview.carely-app.de";
//   const name = "testUser1";
//   const user = new ApiUser(apiHost, name);
//   const password = "XQ92V2v&";
//   const timeout = 5000;
//   await user.login(name, password, timeout);

//   // Define the payload to be sent
//   const payload = ["68da5123-f9a6-475a-b93c-55a94557b6f9-13-0"];

//   // Mock the response from the server
//   const mockResponse = new Response(JSON.stringify(payload), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   globalThis.fetch = async (input, init) => {
//     if (init && init.method === "POST") {
//       assertEquals(init.body, JSON.stringify(payload));
//       return mockResponse;
//     }
//     return new Response(null, { status: 404 });
//   };

//   let response: Response;

//   // Ensure that the post method does not throw an error
//   try {
//     response = await user.post(
//       "/progress/topics/3f714447-643f-49b8-a6f3-4096e058235a/trainings/7b57de4f-f8ba-4e2a-a7c9-679d03098661/questionnaires/68da5123-f9a6-475a-b93c-55a94557b6f9/questions/68da5123-f9a6-475a-b93c-55a94557b6f9-13/answers",
//       payload,
//       timeout
//     );
//   } catch (error) {
//     throw new Error(`post method threw an error: ${error.message}`);
//   }

//   // Read the response body once and parse it
//   const jsonResponse = await response;

//   // Compare the parsed response body with the expected payload
//   assertEquals(jsonResponse.body, mockResponse.body);
// });
