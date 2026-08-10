<template>
  <nuxt-layout
    name="broadsheet"
    eyebrow="Layout reference · broadsheet · Nuxt Kickstart"
    title="A document layout that reads like it was set, not generated"
    :links="links"
    :status="status"
    :footer="footer"
  >
    <template #standfirst>
      <p class="bs-standfirst">
        Broadsheet applies newspaper structure to technical documentation: a masthead
        that says what this is, a standfirst that gives you the whole idea before you
        commit, then lettered sections separated by <strong>hairlines rather than
          shadows</strong>. Everything below is live — the same stylesheet a real
        document gets.
      </p>
    </template>

    <section id="idea">
      <h2><span class="num">A</span>The one rule</h2>

      <p>
        <strong>Monospace for structure, sans for prose.</strong> Mono goes on
        everything that labels, numbers, or names — the eyebrow above, every heading,
        table headers, panel strips, step counters, this page's footer. Sans is
        reserved for body paragraphs: the text a person actually reads at length.
      </p>

      <p>
        That inversion is most of the character. It is why the page reads as a set
        document rather than a wiki article, and it is the first thing to get right
        when adapting the style somewhere else.
      </p>

      <div class="bs-note">
        <span class="bs-note-label">Why the fonts are pinned</span>
        <div class="bs-note-body">
          <p>
            <code>--bs-sans</code> and <code>--bs-mono</code> do not follow
            <code>--theme-font-sans</code>. In this project that variable defaults to
            JetBrains Mono, so inheriting it would make body prose monospace and
            collapse the distinction the layout depends on. Colours theme; the type
            inversion does not.
          </p>
        </div>
      </div>
    </section>

    <section id="structure">
      <h2><span class="num">B</span>Structure</h2>

      <p>
        Build in order. Each part earns its place — drop the ones you have no content
        for rather than padding them out.
      </p>

      <div class="bs-table-wrap">
        <table>
          <thead>
            <tr>
              <th class="mono">
                Part
              </th>
              <th>Carries</th>
              <th>Rule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="mono">
                <code>eyebrow</code>
              </td>
              <td>Where you are</td>
              <td>Dot-separated facts, never a sentence</td>
            </tr>
            <tr>
              <td class="mono">
                <code>h1</code>
              </td>
              <td>The claim</td>
              <td>A claim or a question, not a noun phrase</td>
            </tr>
            <tr>
              <td class="mono">
                <code>standfirst</code>
              </td>
              <td>The whole thesis</td>
              <td>A reader who stops here still learns the point</td>
            </tr>
            <tr>
              <td class="mono">
                <code>status</code>
              </td>
              <td>Actual state</td>
              <td>Omit it rather than invent facts</td>
            </tr>
            <tr>
              <td class="mono">
                <code>rail</code>
              </td>
              <td>Navigation</td>
              <td>Sticky, 196px, ≥1000px only</td>
            </tr>
            <tr>
              <td class="mono">
                <code>footer</code>
              </td>
              <td>Provenance</td>
              <td>Say what it was verified against, and mean it</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="measure">
      <h2><span class="num">C</span>Measure</h2>

      <p>
        The reading length is designed, not incidental. Paragraphs cap at 68
        characters, the standfirst at 60, callout bodies at 62. Widen those and the
        page stops feeling like a document; the eye loses the line return and the
        hairlines start looking like table borders instead of structure.
      </p>

      <p>
        Headings get <code>text-wrap: balance</code> so a two-line title breaks evenly.
        Paragraphs get <code>text-wrap: pretty</code> so no line is left with an
        orphan.
      </p>
    </section>

    <section id="parts">
      <h2><span class="num">D</span>The parts</h2>

      <h3>Panel</h3>

      <p>
        A bordered box with a label strip: uppercase label on the left, dimmed path or
        qualifier on the right. Everything boxed uses this — code, diagrams, terminal
        output.
      </p>

      <div class="bs-panel">
        <div class="bs-panel-head">
          <span>Layout usage</span><span class="path">pages/labs/broadsheet.vue</span>
        </div>
        <pre><span class="c">// layout: false, then name the layout explicitly — that is what</span>
<span class="c">// lets the masthead, rail, and footer take props.</span>
<span class="k">definePageMeta</span>({ layout: <span class="s">false</span> })

&lt;<span class="f">nuxt-layout</span>
  name=<span class="s">"broadsheet"</span>
  eyebrow=<span class="s">"Layout reference · broadsheet"</span>
  title=<span class="s">"A document layout that reads like it was set"</span>
  :links=<span class="s">"links"</span>
  :status=<span class="s">"status"</span>
&gt;</pre>
      </div>

      <h3>Compare</h3>

      <p>Reach for a two-up instead of prose describing a difference. The diff is the argument.</p>

      <div class="bs-compare">
        <div class="bs-panel">
          <div class="bs-panel-head">
            <span class="bs-tag now">Generic</span><span class="path">card.css</span>
          </div>
          <pre>border-radius: <span class="del">8px</span>;
box-shadow: <span class="del">0 1px 3px rgb(0 0 0 / 10%)</span>;
border: <span class="del">none</span>;</pre>
        </div>

        <div class="bs-panel">
          <div class="bs-panel-head">
            <span class="bs-tag next">Broadsheet</span><span class="path">broadsheet.css</span>
          </div>
          <pre>border-radius: <span class="add">0</span>;
box-shadow: <span class="add">none</span>;
border: <span class="add">1px solid var(--bs-rule)</span>;</pre>
        </div>
      </div>

      <h3>Event tree</h3>

      <p>
        Annotated terminal output. Use real values from the actual system — never
        <code>foo</code> or <code>bar</code>. The point is that a reader recognises it.
      </p>

      <div class="bs-panel">
        <div class="bs-panel-head">
          <span>Emitted event</span><span class="path">pretty mode · dev default</span>
        </div>
        <!-- eslint-disable vue/html-indent, vue/multiline-html-element-content-newline -->
        <!-- `.bs-evt` is white-space: pre — every space here is column alignment. -->
        <pre class="bs-evt"><span class="route">POST /api/llm-optimizer/scan</span>   <span class="ok">200</span>   <span class="dur">4.28s</span>
<span class="tree">├─</span> <span class="key">scan.url</span>           <span class="val">https://acme.com</span>
<span class="tree">├─</span> <span class="key">scan.renderUsed</span>    <span class="val">true</span>
<span class="tree">├─</span> <span class="key">scan.score</span>         <span class="val">62</span>
<span class="tree">├─</span> <span class="key">stages.rendering</span>   <span class="val">2840ms</span>
<span class="tree">└─</span> <span class="key">stages.saving</span>      <span class="val">14ms</span>  <span class="fail">✕ persist failed</span></pre>
        <!-- eslint-enable vue/html-indent, vue/multiline-html-element-content-newline -->
      </div>

      <h3>Fan-out</h3>

      <p>One source, many sinks — drawn with boxes and stems rather than an SVG, so it themes and prints.</p>

      <div class="bs-panel">
        <div class="bs-panel-head">
          <span>How a stylesheet reaches the page</span>
        </div>
        <div class="bs-fan">
          <div class="bs-node">
            broadsheet.css<span class="sub">scoped to .bs-shell</span>
          </div>
          <div class="bs-stem" />
          <div class="bs-node emph">
            token aliases<span class="sub">--bs-* → --ui-*</span>
          </div>
          <div class="bs-stem" />
          <div class="bs-spread">
            <div class="bs-node">
              System<span class="sub">app.config</span>
            </div>
            <div class="bs-node">
              Lyra<span class="sub">theme</span>
            </div>
            <div class="bs-node">
              Nord<span class="sub">theme</span>
            </div>
            <div class="bs-node">
              Broadsheet<span class="sub">exact original</span>
            </div>
          </div>
        </div>
      </div>

      <h3>Note</h3>

      <p>
        A labelled box, not a left-stripe card. The inset accent stripe reads as
        “active row” elsewhere in this design system, so the label takes its own
        header strip instead.
      </p>

      <div class="bs-note caution">
        <span class="bs-note-label">Do not add elevation</span>
        <div class="bs-note-body">
          <p>
            One <code>box-shadow</code> undoes the whole register. Separation is done
            by hairlines and surface shifts — <code>--bs-ground</code> to
            <code>--bs-panel</code> to <code>--bs-sunk</code> — and nothing else.
          </p>
        </div>
      </div>

      <h3>Steps</h3>

      <ol class="bs-steps">
        <li>
          <h4>Numbered because order matters</h4>
          <p>
            Leading-zero counters in bordered squares, accent-coloured. If order does
            not matter, use a plain list instead.
          </p>
        </li>
        <li>
          <h4>Each step opens with a heading</h4>
          <p>
            The heading is the action; the paragraph is the caveat. A step with no
            caveat needs no paragraph.
          </p>
        </li>
      </ol>
    </section>

    <section id="use">
      <h2><span class="num">E</span>Using it</h2>

      <p>Three entry points, depending on what you are making.</p>

      <div class="bs-table-wrap">
        <table>
          <thead>
            <tr>
              <th class="mono">
                Want
              </th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A page in this app</td>
              <td class="mono">
                <code>&lt;nuxt-layout name="broadsheet"&gt;</code>
              </td>
            </tr>
            <tr>
              <td>A markdown document</td>
              <td class="mono">
                <code>::broadsheet-panel</code>, <code>::broadsheet-note</code>, …
              </td>
            </tr>
            <tr>
              <td>A standalone HTML doc</td>
              <td class="mono">
                <code>skills/technical-broadsheet/assets/template.html</code>
              </td>
            </tr>
            <tr>
              <td>The exact source palette</td>
              <td class="mono">
                <code>data-theme="broadsheet"</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The colours here alias onto Nuxt UI's <code>--ui-*</code> variables, so this
        page renders correctly under every theme and in both colour modes. Switch
        themes and watch the signal colour, rules, and surfaces move together — the
        structure never does.
      </p>
    </section>
  </nuxt-layout>
</template>

<script setup lang="ts">
// `layout: false` + an explicit <nuxt-layout name="broadsheet"> is the only way
// to pass props to a layout. Naming the layout in definePageMeta instead would
// apply it automatically, but with no masthead, rail, or footer data.
definePageMeta({
  layout: false,
})

// Document copy lives inline rather than in i18n/locales: this page is design
// reference material — the specimen text is part of what it demonstrates, the
// same way guide bodies live in content/ rather than in message files.
const links = [
  { id: 'idea', label: 'The one rule' },
  { id: 'structure', label: 'Structure' },
  { id: 'measure', label: 'Measure' },
  { id: 'parts', label: 'The parts' },
  { id: 'use', label: 'Using it' },
]

const status = [
  { label: 'Layout', value: 'broadsheet', state: 'on' as const },
  { label: 'Stylesheet', value: 'scoped', state: 'on' as const },
  { label: 'Themes', value: 'all 7', state: 'on' as const },
  { label: 'MDC blocks', value: '5', state: 'on' as const },
  { label: 'Radius', value: '0', state: 'off' as const },
]

const footer = [
  'app/layouts/broadsheet.vue',
  '.claude/skills/technical-broadsheet',
  'Rendered with the live stylesheet, not a screenshot',
]

useSeoMeta({
  title: 'Broadsheet layout',
  description: 'Live reference for the technical broadsheet document layout.',
})
</script>
