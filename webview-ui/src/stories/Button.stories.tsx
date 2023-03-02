import React from "react";
import { vscode } from "../utilities/vscode";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

import { Button } from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Button",
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VSCodeButton> = (args) => <VSCodeButton {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  children: "Howdy",
  onClick: () =>
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    }),
};
