import {
  Moon as MoonIcon,
  Sun as SunIcon,
  Laptop2 as SystemIcon,
} from "lucide-react";
import QRCodeLink from "qrcode";
import { ChangeEvent, useEffect, useState } from "react";
import QRCode from "react-qr-code";

type ThemeOptionsProps = {
  icon: JSX.Element;
  theme: "light" | "dark" | "system";
};

const App = () => {
  const [link, setLink] = useState("");
  const [qrcodeLink, setQrcodeLink] = useState("");
  const [theme, setTheme] = useState(
    localStorage.getItem("qrcodeTheme") ?? "system"
  );
  const element = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleQrcode = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLink(value);
    handleGenerate(value);
  };

  const handleGenerate = (link_url: string) => {
    QRCodeLink.toDataURL(
      link_url,
      {
        width: 600,
        margin: 3,
      },
      (_err, url) => {
        setQrcodeLink(url);
      }
    );
  };

  const themeOptions: ThemeOptionsProps[] = [
    {
      icon: <SunIcon />,
      theme: "light",
    },
    {
      icon: <MoonIcon />,
      theme: "dark",
    },
    {
      icon: <SystemIcon />,
      theme: "system",
    },
  ];

  const handleTheme = (theme: "light" | "dark" | "system") => {
    setTheme(theme);
  };

  useEffect(() => {
    switch (theme) {
      case "dark":
        element.classList.add("dark");
        localStorage.setItem("qrcodeTheme", "dark");
        break;
      case "light":
        element.classList.remove("dark");
        localStorage.setItem("qrcodeTheme", "light");
        break;
      default:
        if (darkQuery.matches) {
          element.classList.add("dark");
        } else {
          element.classList.remove("dark");
        }
        localStorage.removeItem("qrcodeTheme");
        break;
    }
  }, [darkQuery.matches, element.classList, theme]);

  darkQuery.addEventListener("change", (e) => {
    if (!("qrcodeTheme" in localStorage)) {
      if (e.matches) {
        element.classList.add("dark");
      } else {
        element.classList.remove("dark");
      }
    }
  });

  return (
    <div className="h-screen flex justify-center items-center p-6 bg-gray-100 dark:bg-slate-900">
      <div className="w-full max-w-80 max-h-full overflow-y-auto flex flex-col items-center gap-8">
        <div className="flex justify-center items-center gap-3">
          {themeOptions.map((op) => (
            <button
              type="button"
              key={op.theme}
              className={`outline-none rounded-lg p-3 transition-colors ${
                op.theme === theme
                  ? "bg-slate-900 text-gray-100 hover:bg-slate-700 dark:text-slate-900 dark:bg-gray-300 dark:hover:bg-gray-100"
                  : "bg-transparent text-slate-900 dark:text-gray-100 hover:bg-slate-900 hover:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-slate-900"
              }`}
              onClick={() => handleTheme(op.theme)}
            >
              {op.icon}
            </button>
          ))}
        </div>
        <input
          type="url"
          placeholder="Enter your link"
          className="h-12 rounded-lg w-full p-2 px-4 outline-none border-solid border-[1px] border-slate-900
          bg-transparent
          text-slate-900
          dark:text-gray-100
          dark:border-gray-100"
          value={link}
          onChange={handleQrcode}
        />
        <QRCode value={link} />
        <a
          href={qrcodeLink}
          download="qrcode.png"
          className="bg-slate-900 text-gray-100 dark:bg-gray-300 dark:text-slate-900 h-12 rounded-lg w-full p-2 px-4 border-none flex justify-center items-center hover:bg-slate-700 dark:hover:bg-gray-100 transition-colors font-bold cursor-pointer"
        >
          Click me to download QRCode
        </a>
      </div>
    </div>
  );
};

export default App;
