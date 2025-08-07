import Link from "next/link";
import Image from "next/image";
import LinkAttributeType from "@/interface/LinkAttributeType";
import { YouTubeEmbed } from "@next/third-parties/google";

const CustomLink = (props: any) => {
  const { href, className, children, product } = props;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  let linkAttributes: LinkAttributeType = {};
  if (!isInternalLink) {
    linkAttributes.target = "_blank";
    linkAttributes.rel = "noopener noreferrer";
  }

  var linkText = children;
  if (product) {
    linkText += " ↗";
  }

  return (
    <Link
      href={href}
      {...props}
      {...linkAttributes}
      className={
        className != "anchor"
          ? "underline-offset-4 decoration-2 decoration-indigo-500 hover:decoration-indigo-700 dark:decoration-indigo-400 dark:hover:decoration-indigo-200  text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200"
          : className
      }
    >
      {linkText}
    </Link>
  );
};

const CustomImage = (props: any) => {
  return (
    <>
      <Image
        width="700"
        height="400"
        className="rounded-xl mb-4 mx-auto"
        alt="Blog Image"
        {...props}
      />
      <p className="text-center text-sm text-gray-500 mt-0">{props.alt}</p>
    </>
  );
};

const Embed = ({
  src,
  videoid,
  ...props
}: {
  src?: string;
  videoid?: string;
  props: any;
}) => {
  if (videoid) {
    return <YouTubeEmbed style="border-radius: 0.75rem" videoid={videoid} />;
  }

  if (src) {
    return (
      <iframe
        className="aspect-video w-full rounded-xl"
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        {...props}
      />
    );
  }

  return null;
};

const BlockQuote = (props: any) => {
  return (
    <div className="flex h-auto px-4">
      <div className="bg-indigo-300 rounded w-1" />
      <div className="pl-2 flex-1 m-1">
        {props.children.map((child: any, index: number) => {
          if (child.props) {
            return (
              <p className="mt-3 p-0" key={index}>
                {child.props.children}
              </p>
            );
          }
        })}
      </div>
    </div>
  );
};

const CustomUL = (props: any) => {
  return <ul className="space-y-1" {...props} />;
};

const CustomOL = (props: any) => {
  return <ol className="space-y-1" {...props} />;
};

const CustomLI = (props: any) => {
  return <li className="my-1" {...props} />;
};

const MDXComponents = {
  Embed: Embed,
  Image: CustomImage,
  a: CustomLink,
  blockquote: BlockQuote,
  ul: CustomUL,
  ol: CustomOL,
  li: CustomLI,
};

export { CustomLink };

export default MDXComponents;
