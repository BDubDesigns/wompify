console.log("Wompify content script loaded");
import nlp from "compromise";

// 1. Define the replacement function
function replaceVerbsInText(text: string): string {
  const doc = nlp(text);
  const verbs = doc.verbs();
  let newText = text;

  const replacements: { from: string; to: string }[] = [];

  verbs.forEach((verb_match) => {
    const verbText = verb_match.text("normal");
    const json = verb_match.json()[0];
    const tags = json?.tags;
    let wompedVerb = "womp";

    if (tags?.includes("PastTense")) {
      wompedVerb = "womped";
    } else if (tags?.includes("PresentTense")) {
      if (verbText.endsWith("s")) {
        wompedVerb = "womps";
      }
    } else if (tags?.includes("Gerund")) {
      wompedVerb = "womping";
    }
    replacements.push({ from: verbText, to: wompedVerb });
  });

  // de-duplicate replacements to avoid re-replacing
  const uniqueReplacements = replacements.filter(
    (v, i, a) => a.findIndex((t) => t.from === v.from) === i
  );

  uniqueReplacements.forEach((rep) => {
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapeRegex(rep.from)}\\b`, "gi");
    newText = newText.replace(
      regex,
      `<span class="womp-verb">${rep.to}</span>`
    );
  });

  return newText;
}

// 2. Walk the DOM and replace verbs in text nodes
function walkAndWompify(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.textContent) {
      const newNode = document.createElement("span");
      newNode.innerHTML = replaceVerbsInText(node.textContent);
      node.parentNode?.replaceChild(newNode, node);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
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
    }
  `;
  document.head.appendChild(style);
}

// 4. Run it
function wompifyVerbs() {
  injectStyles();
  walkAndWompify(document.body);
  console.log("Wompify finished.");
}

wompifyVerbs();
