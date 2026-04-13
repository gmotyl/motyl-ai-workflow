# czytaj - Polish Text-to-Speech Command

Convert text to speech and play it aloud in Polish using Marek's natural voice.

## Usage

```bash
czytaj "Your text here"
```

or in Polish:

```bash
czytaj "Twój tekst tutaj"
```

## What It Does

1. Converts text to speech in Polish using `edge-tts`
2. Plays audio using `afplay` (macOS native player)
3. **Automatically deletes the temporary MP3 file after playback finishes**

## Installation

Add this function to your `~/.zshrc`:

```bash
czytaj() {
  if [ -z "$1" ]; then
    echo "Usage: czytaj \"text to speak\""
    return 1
  fi

  local tmpfile=$(mktemp).mp3
  uvx edge-tts --voice "pl-PL-MarekNeural" --text "$1" --write-media "$tmpfile" && \
  afplay "$tmpfile" && \
  rm "$tmpfile"
}
```

Then reload your shell:

```bash
source ~/.zshrc
```

## Examples

**Speak a simple phrase:**
```bash
czytaj "Cześć! Jak się masz?"
```

**Speak a longer text:**
```bash
czytaj "Claude Code to potężne narzędzie do pracy ze sztuczną inteligencją."
```

## Voice Options

- **Polish (Marek - Natural, Male)**: `pl-PL-MarekNeural` (default for czytaj)

To see all available voices:

```bash
uvx edge-tts --list-voices
```

## Technical Details

- **Text-to-Speech Engine**: Microsoft Edge TTS (via `edge-tts`)
- **Audio Player**: `afplay` (macOS)
- **Temp File Cleanup**: Automatic - file deleted after playback completes
- **Format**: MP3

## Troubleshooting

**"czytaj: command not found"**
- Add the function to `~/.zshrc` and run `source ~/.zshrc`

**"uvx: command not found"**
- Install Uv: https://docs.astral.sh/uv/
- Or use: `pip install edge-tts` and replace `uvx edge-tts` with `edge-tts`

**Audio not playing**
- Check that `afplay` is available (standard on macOS)
- For other OS, modify the player command (e.g., `mpv`, `play`, `paplay`)
