import {
  Body,
  Container,
  Html,
  Tailwind,
  Head,
  Preview,
  Font,
  Section,
} from "@react-email/components";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import * as React from "react";
import { COMPONENTS_MAP } from "./components";

const EmailData = {
  header: {
    value: {
      logo: {
        src: "https://avatars.githubusercontent.com/u/159687000?s=200&v=4",
        alt: "logo",
        width: 32,
        height: 32,
      },
      title: {
        text: "IntentJs",
        className: "",
      },
    },
    className: "",
  },
  footer: {
    value: {
      logo: {
        src: "https://avatars.githubusercontent.com/u/159687000?s=200&v=4",
        alt: "logo",
        width: 32,
        height: 32,
      },
      title: {
        text: "IntentJs",
        className: "",
      },
      content: "for your notes, tasks, wikis, and databases.",
    },
    className: "",
  },
  components: [
    {
      type: "link",
      value: {
        link: "/",
        title: "Click here to log in with this magic link",
      },
      className: "",
    },
    {
      type: "text",
      value:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      className: "",
    },
    {
      type: "code",
      value: "sparo-ndigo-amurt-secan",
      className: "",
    },
    {
      type: "greeting",
      value: "Jhon",
      className: "",
    },
    {
      type: "button",
      value: {
        link: "/",
        title: "Click here to log in with this magic link",
      },
      className: "",
    },
    {
      type: "markdown",
      value: "## What is Intent?",
    },
    {
      type: "reactComponent",
      value: {
        code: `export default async (req, res) => {
  try {
    const html = await renderAsync(
      EmailTemplate({ firstName: 'John' })
    );
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error });
  }
}`,
        lineNumbers: true,
      },
    },
    {
      type: "table",
      value: [
        ["hello", "hello", "hello", "hello"],
        ["world", "world", "world", "world"],
        ["hello", "hello", "hello", "hello"],
      ],
      className: "",
    },
    {
      type: "regard",
      value: "Intent Team",
      className: "",
    },
  ],
};

export const App = () => {
  return (
    <Html>
      <Head>
        <title>IntentJs</title>
        <Font
          fontFamily="Urbanist"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap",
            format: "woff2",
          }}
        />
      </Head>
      <Preview>Welcome to IntentJs</Preview>

      <Tailwind>
        <Body className="bg-white">
          <Container className="px-3 mx-auto">
            <Header
              className={EmailData.header.className}
              value={EmailData.header.value}
            />

            {EmailData.components.map((item, index) => {
              const { type, className, value } = item;
              return (
                <Section key={index} className="mb-5">
                  {COMPONENTS_MAP[type]
                    ? COMPONENTS_MAP[type]({ className, value })
                    : null}
                </Section>
              );
            })}

            <Footer
              className={EmailData.header.className}
              value={EmailData.header.value}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default App;
