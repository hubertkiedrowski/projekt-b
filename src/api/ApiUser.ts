import { LoginResponse } from "../interfaces.ts";

export class ApiUser {
  private token: string;
  private readonly apiHost: string;
  private name: string;
  readonly uuid: string;

  constructor(apiHost: string, name: string) {
    this.uuid = crypto.randomUUID();

    this.token = "";
    this.apiHost = `${apiHost}/api`;
    this.name = name;
  }

  function(url: string, options: any, timeout = 7000) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeout)
      ),
    ]);
  }

  /**
   * Logs in the user with the provided login and password.
   * @param {string} login - The user's login credetials .
   * @param {string} password - The user's password.
   * @param {number} timeout - The timeout for the API request.
   * @returns {Promise<string>} - A promise that resolves to the authentication token.
   */
  public login(login: string, password: string, timeout: number) {
    return this.post("/auth/login", { login, password }, timeout)
      .then(async (resp) => {
        if (resp.ok) {
          const j = await resp.json().then((j: LoginResponse) => {
            return j;
          });

          return j.token;
        } else {
          console.log("NOT OK: ", resp.statusText);
        }
      })
      .then((token) => {
        this.token = token ?? "";
      });
  }

  /**
   * @endpoint: string (exmaple: /topic/)
   */
  public get(endpoint: string, timeout: number) {
    return new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(() => {
        console.warn("timeout of ", timeout, " for ", endpoint);
        reject(new Error("Timeout while fetching data"));
      }, timeout);
      const url = `${this.apiHost}${endpoint}`;
      fetch(url, {
        headers: {
          "content-type": "application/json",
          authorization: this.token.length > 0 ? `Bearer ${this.token}` : "",
        },
      })
        .then((response) => {
          clearTimeout(timer);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response;
        })
        .then((jsonData) => {
          resolve(jsonData);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  /**
   * Creates a new user with the specified name, surname, and login credentials, password is Passwort14!.
   * @param name - The name of the user.
   * @param surname - The surname of the user.
   * @param loginCredentials - The login credentials of the user.
   * @returns A Promise that resolves to void.
   */
  public async createUser(
    name: string,
    surname: string,
    loginCredentials: string
  ): Promise<void> {
    try {
      const response = await this.post(
        "/auth/admin/users",
        {
          name: name,
          surname: surname,
          salutation: "-",
          login: loginCredentials,
          password: "Passwort14!.",
          roles: ["employee"],
          facility: null,
          activities: ["1", "2", "3", "4", "5"],
          qualifications: ["3", "2", "1"],
        },
        5000
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  public post(endpoint: string, payload: object, timeout: number) {
    return new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Timeout while fetching data"));
      }, timeout);
      const url = `${this.apiHost}${endpoint}`;

      fetch(url, {
        headers: {
          "content-type": "application/json",
          authorization: this.token.length > 0 ? `Bearer ${this.token}` : "",
        },
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then((response) => {
          clearTimeout(timer);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response;
        })
        .then((jsonData) => {
          resolve(jsonData);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  public getToken() {
    return this.token;
  }
  public getName() {
    return this.name;
  }
}
