import { describe, expect, it } from "vitest";

import { getAdapterDisplay, getAdapterLabel, getAdapterLabels } from "./adapter-display-registry";

describe("adapter display registry", () => {
  it("uses user-facing labels without the legacy local qualifier for built-in adapters", () => {
    expect(getAdapterLabel("codex_local")).toBe("Codex");
    expect(getAdapterLabel("claude_local")).toBe("Claude Code");
    expect(getAdapterLabel("acpx_local")).toBe("ACPX (retired)");
    expect(getAdapterLabel("cursor")).toBe("Cursor");
    expect(getAdapterLabel("gemini_local")).toBe("Gemini CLI");
    expect(getAdapterLabel("grok_local")).toBe("Grok Build");
    expect(getAdapterLabel("kimi_local")).toBe("Kimi Code");
    expect(getAdapterLabel("hermes_local")).toBe("Hermes");
    expect(getAdapterLabel("hermes_gateway")).toBe("Hermes Gateway");
    expect(getAdapterLabel("opencode_local")).toBe("OpenCode");
    expect(getAdapterLabel("pi_local")).toBe("Pi");

    expect(getAdapterLabels()).toMatchObject({
      codex_local: "Codex",
      claude_local: "Claude Code",
      acpx_local: "ACPX (retired)",
      cursor: "Cursor",
      gemini_local: "Gemini CLI",
      grok_local: "Grok Build",
      kimi_local: "Kimi Code",
      hermes_local: "Hermes",
      hermes_gateway: "Hermes Gateway",
      opencode_local: "OpenCode",
      pi_local: "Pi",
    });
  });

  it("drops local suffixes for unknown plugin adapter labels", () => {
    expect(getAdapterLabel("droid_local")).toBe("Droid");
    expect(getAdapterDisplay("droid_local")).toMatchObject({
      label: "Droid",
      description: "External adapter",
    });
  });

  it("keeps a gateway suffix for unknown plugin adapter labels", () => {
    expect(getAdapterLabel("droid_gateway")).toBe("Droid (gateway)");
    expect(getAdapterDisplay("droid_gateway")).toMatchObject({
      label: "Droid (gateway)",
      description: "External gateway adapter",
    });
  });

  it("recommends exactly the sources the connect step offers as tiles", () => {
    // `recommended` is the whole of what puts a source on the connect step's
    // tile row: the wizard filters the adapter grid on this flag and renders
    // only the result, so an adapter carrying it is reachable during onboarding
    // and one missing it is not — there is no other route, since the
    // "Advanced settings" disclosure that used to list the rest is gone.
    //
    // The list is pinned exactly rather than by inclusion so a fourth
    // recommendation cannot land here unnoticed: it would appear as a tile on a
    // row sized for three (see `collapsedTileWidth`) and would have to work
    // end-to-end to earn its place.
    const recommended = Object.keys(getAdapterLabels()).filter(
      (type) => getAdapterDisplay(type).recommended === true,
    );
    expect(recommended.sort()).toEqual(["claude_local", "codex_local", "opencode_local"]);
  });
});
