/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Revcast Cloud URL - Optional override for the hosted Revcast billing site. Leave empty unless you're testing your own deployment. */
  "revcastApiBaseUrl"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `rev` command */
  export type Rev = ExtensionPreferences & {}
  /** Preferences accessible in the `failed` command */
  export type Failed = ExtensionPreferences & {}
  /** Preferences accessible in the `projects` command */
  export type Projects = ExtensionPreferences & {}
  /** Preferences accessible in the `license` command */
  export type License = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `rev` command */
  export type Rev = {}
  /** Arguments passed to the `failed` command */
  export type Failed = {}
  /** Arguments passed to the `projects` command */
  export type Projects = {}
  /** Arguments passed to the `license` command */
  export type License = {}
}

