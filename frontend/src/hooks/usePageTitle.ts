import { useEffect } from "react";

const DEFAULT_TITLE = "St. Marks Graveyard";

/**
 * A hook to set the page title to a custom value when a component mounts, and reset it when the component unmounts
 */
const usePageTitle = (title: string | undefined): void => {
  useEffect(() => {
    document.title = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  }, [title]);

  useEffect(
    () => () => {
      document.title = DEFAULT_TITLE;
    },
    []
  );
};

export default usePageTitle;
