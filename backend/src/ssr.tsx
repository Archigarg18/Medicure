import { renderToString } from "react-dom/server";
import { PrismaClient } from "@prisma/client";
import React from "react";

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

interface SSRPageProps {
  initialData?: any;
  userId?: string;
  url?: string;
}

const BackendApp = () => (
  <div>
    <h1>Heal Home Net</h1>
    <p>This is a backend SSR placeholder page. Frontend app rendering is handled by the client.</p>
  </div>
);

/**
 * Render App component to HTML string for SSR
 */
export async function renderAppToString(
  props: SSRPageProps = {}
): Promise<string> {
  try {
    const appMarkup = renderToString(<BackendApp />);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Heal Home Net - Hospital Management System</title>
          <meta name="description" content="Heal Home Net - Complete Hospital Management System" />
          <meta name="keywords" content="hospital, healthcare, management, appointments, ambulance, blood bank" />
          <meta name="theme-color" content="#1f2937" />
        </head>
        <body>
          <div id="root">${appMarkup}</div>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(props.initialData || {})};
            window.__USER_ID__ = ${JSON.stringify(props.userId || null)};
          </script>
        </body>
      </html>
    `;

    return html;
  } catch (error) {
    console.error("SSR rendering error:", error);
    throw error;
  }
}

/**
 * Fetch initial data for SSR
 */
export async function fetchInitialData(userId?: string): Promise<any> {
  try {
    const data: any = {
      timestamp: new Date().toISOString(),
      userId,
    };

    if (userId) {
      // Fetch user data
      // const user = await prisma.user.findUnique({
      //   where: { id: userId },
      //   select: { id: true, email: true, name: true },
      // });
      // data.user = user;
    }

    return data;
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {};
  }
}

export default renderAppToString;
