import {
  KBarAnimator,
  KBarProvider,
  KBarPortal,
  useMatches,
  KBarPositioner,
  KBarSearch,
  KBarResults,
  Action,
} from "kbar";
import {
  BracketsCurly,
  CircleHalf,
  Clock,
  Copy,
  FinnTheHuman,
  Heart,
  Moon,
  Scroll,
  Sun,
} from "@phosphor-icons/react";
import Markdown from "react-markdown";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import remarkGfm from "remark-gfm";

export default function CommandBar({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const actions = [
    {
      id: "copy",
      name: "Copy URL",
      shortcut: ["c"],
      keywords: "copy-url",
      section: "General",
      perform: () => navigator.clipboard.writeText(window.location.href),
      icon: <Copy size={20} />,
    },
    {
      id: "me",
      name: "Me",
      shortcut: ["m"],
      keywords: "go-me",
      section: "Go To",
      perform: () => router.push("/me"),
      icon: <FinnTheHuman size={20} />,
    },
    {
      id: "blog",
      name: "Blog",
      shortcut: ["b"],
      keywords: "go-setup",
      section: "Go To",
      perform: () => router.push("/blog"),
      icon: <Scroll size={20} />,
    },
    {
      id: "now",
      name: "Now",
      shortcut: ["n"],
      keywords: "go-now",
      section: "Go To",
      perform: () => router.push("/now"),
      icon: <Clock size={20} />,
    },
    {
      id: "favorites",
      name: "Favorites",
      shortcut: ["f"],
      keywords: "go-favorites",
      section: "Go To",
      perform: () => router.push("/favorites"),
      icon: <Heart size={20} />,
    },
    {
      id: "source",
      name: "View Source",
      shortcut: ["s", "o"],
      keywords: "view-source",
      section: "General",
      perform: () =>
        window.open("https://github.com/weichunnn/weichuntan.com", "_blank"),
      icon: <BracketsCurly size={20} />,
    },
    {
      id: "theme",
      name: "Change theme",
      shortcut: [],
      keywords: "interface-color-dark-light-theme",
      section: "Theme",
      icon: <CircleHalf size={20} />,
    },
    {
      id: "darkTheme",
      name: "Dark",
      shortcut: [],
      keywords: "dark",
      section: "Theme",
      perform: () => setTheme("dark"),
      parent: "theme",
      icon: <Moon size={20} />,
    },
    {
      id: "lightTheme",
      name: "Light",
      shortcut: [],
      keywords: "light",
      section: "Theme",
      perform: () => setTheme("light"),
      parent: "theme",
      icon: <Sun size={20} />,
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <Positioner>
          <Animator>
            <Search />
            <RenderResults />
          </Animator>
        </Positioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item }) =>
        typeof item === "string" ? (
          <GroupName>{item}</GroupName>
        ) : (
          <ResultItem action={item} />
        )
      }
    />
  );
}

const ResultItem = forwardRef(({ action }: { action: Action }, ref) => {
  const isCompletion = (action as any).completion ?? false;
  if (isCompletion) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="p-2 cursor-pointer h-72"
      >
        {action.name == "" ? (
          <div className="flex h-full items-center justify-center">
            I'm searching my brain :D
          </div>
        ) : (
          <article className="prose dark:prose-invert prose-sm prose-slate max-w-full">
            <Markdown remarkPlugins={[remarkGfm as any]}>
              {action.name}
            </Markdown>
          </article>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="p-2 flex items-center justify-between cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-200 rounded-xl"
    >
      <div className="flex items-center gap-4">
        {action.icon && action.icon}
        <span>{action.name}</span>
      </div>
      {action.shortcut?.length ? (
        <div className="flex items-center gap-4">
          {action.shortcut.map((shortcut) => (
            <Kbd key={shortcut}>{shortcut}</Kbd>
          ))}
        </div>
      ) : null}
    </div>
  );
});

// required to overcome eslint displayName error
// ref: https://stackoverflow.com/a/67993106
ResultItem.displayName = "ResultItem";

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="dark:bg-gray-500 bg-gray-300 rounded py-1 px-2 uppercase">
    {children}
  </kbd>
);

const Positioner = ({ children }: { children: ReactNode }) => (
  <KBarPositioner className="fixed flex items-start justify-center w-full inset-0 p-[14vh_16px_16px] box-border backdrop-blur-xs">
    {children}
  </KBarPositioner>
);

const Search = () => (
  <KBarSearch className="p-4 w-full	outline-hidden border-none m-0 dark:bg-[#1C191C] bg-white" />
);

const Animator = ({ children }: { children: ReactNode }) => (
  <KBarAnimator className="max-w-[750px] box-content w-full dark:bg-[#1C191C] bg-white shadow-lg rounded-xl overflow-hidden p-2">
    {children}
  </KBarAnimator>
);

const GroupName = ({ children }: { children: ReactNode }) => (
  <div className="uppercase text-xs py-4 px-2 tracking-wider">{children}</div>
);
