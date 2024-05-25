import { Font } from "@react-email/components";

export const Typography = () => {
  return (
    <Font
      fontFamily="Inter"
      fallbackFontFamily="Arial"
      webFont={{
        format: "woff2",
        url: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2",
      }}
    />
  );
};
