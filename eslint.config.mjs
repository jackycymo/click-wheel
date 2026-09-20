// One config for the workspace: the website's Next.js rules, applied to the
// site and to the package's web files (the React Hooks rules matter there).
import website from "./website/eslint.config.mjs";

export default [
  ...website,
  {
    settings: {
      next: { rootDir: "website/" },
    },
  },
];
