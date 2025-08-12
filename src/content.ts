console.log("Wompify content script loaded");
import nlp from "compromise";

const DEBUG = true;
let replacedVerbs: { from: string; to: string; parentNode?: string }[] = []; // Moved to global scope

function applyCase(originalWord: string, newWord: string): string {
  if (!originalWord || !newWord) {
    return newWord;
  }

  // Check if the original word is all uppercase
  if (originalWord === originalWord.toUpperCase()) {
    return newWord.toUpperCase();
  }

  // Check if the original word is capitalized (first letter uppercase, rest lowercase)
  if (
    originalWord.charAt(0) === originalWord.charAt(0).toUpperCase() &&
    originalWord.slice(1) === originalWord.slice(1).toLowerCase()
  ) {
    return newWord.charAt(0).toUpperCase() + newWord.slice(1).toLowerCase();
  }

  // Default to lowercase
  return newWord.toLowerCase();
}

// 1. Define the replacement function
function replaceVerbsInText(text: string, parentNodeName?: string): string {
  const doc = nlp(text);
  const verbs = doc.verbs();
  let newText = text;

  const replacements: { from: string; to: string }[] = [];

  verbs.forEach((verb_match) => {
    const verbText = verb_match.text(); // Changed from .text("normal")

    // Filter out empty strings
    if (verbText.length === 0) {
      if (DEBUG) {
        console.log("Skipping empty verbText");
      }
      return;
    }

    // Filter out verbs with symbols
    if (/[^a-zA-Z]/.test(verbText)) {
      if (DEBUG) {
        console.log("Skipping verb with symbols:", verbText);
      }
      return;
    }

    const json = verb_match.json()[0];
    const tags = json?.terms[0]?.tags;
    let wompedVerb = "womp";

    if (DEBUG) {
      console.log("Verb found:", verbText, "Verb Match Object:", verb_match);
      console.log("Full JSON:", verb_match.json());
      console.log("Tags:", tags);
      if (tags?.includes("PastTense")) {
        console.log("  Identified as PastTense");
      } else if (tags?.includes("PresentTense")) {
        console.log("  Identified as PresentTense");
      } else if (tags?.includes("Gerund")) {
        console.log("  Identified as Gerund");
      } else {
        console.log('  Tense not identified, defaulting to "womp"');
      }
    }

    if (tags?.includes("Gerund")) {
      // Check Gerund first
      wompedVerb = "womping";
    } else if (tags?.includes("PastTense")) {
      wompedVerb = "womped";
    } else if (tags?.includes("PresentTense")) {
      if (verbText.endsWith("s")) {
        wompedVerb = "womps";
      }
    } else {
      wompedVerb = "womp";
    }

    // Apply case preservation
    wompedVerb = applyCase(verbText, wompedVerb);

    replacements.push({ from: verbText, to: wompedVerb });
  });

  // de-duplicate replacements to avoid re-replacing
  const uniqueReplacements = replacements.filter(
    (v, i, a) => a.findIndex((t) => t.from === v.from) === i
  );

  uniqueReplacements.forEach((rep) => {
    if (DEBUG) {
      replacedVerbs.push({
        from: rep.from,
        to: rep.to,
        parentNode: parentNodeName,
      }); // Push to new array
    }
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapeRegex(rep.from)}\\b`, "gi");
    newText = newText.replace(
      regex,
      `<span class="womp-verb" data-originalword="${rep.from}">${rep.to}</span>`
    );
  });

  return newText;
}

// 2. Walk the DOM and replace verbs in text nodes
function walkAndWompify(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Ignore text nodes in script, style, and noscript tags
    if (
      node.parentNode &&
      (node.parentNode.nodeName === "SCRIPT" ||
        node.parentNode.nodeName === "STYLE" ||
        node.parentNode.nodeName === "NOSCRIPT")
    ) {
      return;
    }

    if (node.textContent) {
      const newNode = document.createElement("span");
      newNode.innerHTML = replaceVerbsInText(
        node.textContent,
        node.parentNode?.nodeName
      );
      node.parentNode?.replaceChild(newNode, node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Do not traverse script, style, and noscript tags
    if (
      node.nodeName === "SCRIPT" ||
      node.nodeName === "STYLE" ||
      node.nodeName === "NOSCRIPT"
    ) {
      return;
    }
    // Recursively call for child nodes
    Array.from(node.childNodes).forEach(walkAndWompify);
  }
}

// 3. Inject styles
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .womp-verb {
      text-decoration: underline;
      position: relative; /* Needed for absolute positioning of tooltip */
    }

    .womp-verb::before {
      content: attr(data-originalword); /* Display the attribute value */
      position: absolute;
      bottom: 100%; /* Position above the word */
      left: 50%;
      transform: translateX(-50%);
      background-color: black;
      color: white;
      padding: 5px;
      border-radius: 3px;
      white-space: nowrap; /* Prevent text wrapping */
      opacity: 0; /* Hidden by default */
      transition: opacity 0.2s ease-in-out; /* Smooth transition */
      pointer-events: none; /* Allow clicks on the underlying element */
      z-index: 1000; /* Ensure it's above other content */
    }

    .womp-verb:hover::before {
      opacity: 1; /* Show on hover */
    }
  `;
  document.head.appendChild(style);
}

// 4. Run it
function wompifyVerbs() {
  if (DEBUG) {
    // Clear the array at the beginning of each run
    replacedVerbs = [];
  }
  injectStyles();
  walkAndWompify(document.body);
  console.log("Wompify finished.");
  if (DEBUG) {
    // Log the array at the end of the entire process
    console.log("All replacements:", replacedVerbs);
  }
}

window.onload = wompifyVerbs;
