/*

This file is needed until @material-ui/styles is out of alpha.

Until then, the package needs to patch is new styling back into the core of material-ui,
and this has to happen before any of the material-ui code is loaded.

Because this has to happen before loading material-ui, this is the very fist import of our
client entrypoint in entry/client.tsx

*/

import { install as installMuiStyles } from "@material-ui/styles";
installMuiStyles();
