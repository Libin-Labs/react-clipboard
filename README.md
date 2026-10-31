# @lp-labs/react-clipboard

Clipboard write state with size limits, explicit errors and no legacy HTML fallback. React 18+ peer only; TypeScript, ESM and CommonJS included.

## Installation

```sh
npm install @lp-labs/react-clipboard
```

## Quick Start

```jsx
import { useClipboard } from '@lp-labs/react-clipboard';
export default function Example() {
  const clipboard = useClipboard();
  return (
    <>
      <button onClick={() => clipboard.copy('Hello')}>Copy</button>
      <output aria-live="polite">{clipboard.status}</output>
      {clipboard.error && <p role="alert">{clipboard.error.message}</p>}
    </>
  );
}
```

## API

`useClipboard({maxLength=1048576,resetAfter=2000})` returns `copy(text):Promise<boolean>`, `status` (`idle/copying/success/error`), `error`, `permission`, `checkPermission()` and `reset()`. Permissions remain `unknown` where permission querying is unsupported. Only the latest copy attempt updates status; timers and late updates are cleaned up on unmount. Set resetAfter0 to retain success status.

## Benefits

| Area               | Details                                |
| ------------------ | -------------------------------------- |
| No legacy fallback | Use the secure Clipboard API only.     |
| Explicit failures  | Expose permission and write errors.    |
| Bounded input      | Limit clipboard text and status timer. |

## Customization

| Area       | Details                                         |
| ---------- | ----------------------------------------------- |
| Limits     | Set maximum text length and success reset time. |
| Permission | Query permission when supported.                |
| UX         | Use status/error state and reset explicitly.    |

## Security And Limits

Requires HTTPS/localhost, Clipboard API support, user activation and browser permission. Text is capped at 1,048,576 UTF-16 code units; reset delay is 0–60,000 ms. Failure returns false and sets error; it never falls back to document.execCommand or hidden HTML. Permission status is not a guarantee of success. Never copy secrets without a deliberate user action. Clipboard reading is not implemented.

## Support

[Donate via PayPal](https://www.paypal.me/LibinPrasanth). Author: [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/).

## License

MIT License. See the packaged [LICENSE](LICENSE) file.
