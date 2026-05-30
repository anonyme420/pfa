"""
Wraps every tikzpicture / ganttchart inside a figure with \resizebox{\linewidth}{!}{...}
Skips the deployment diagram (fig:deployment) which gets a full rewrite.
"""
import re, sys

SRC = r'C:\Users\ALPHA\pfa\report_original.tex'

with open(SRC, encoding='utf-8') as f:
    lines = f.readlines()

content = ''.join(lines)

# ── helper: wrap a single-env block ─────────────────────────────────────────
def wrap_env(content, begin_tag, end_tag, skip_labels=None):
    """
    Find every begin_tag...end_tag pair and wrap with \resizebox{\linewidth}{!}{...}
    unless the surrounding figure contains a label listed in skip_labels.
    """
    skip_labels = skip_labels or []
    result = []
    pos = 0
    while True:
        start = content.find(begin_tag, pos)
        if start == -1:
            result.append(content[pos:])
            break
        # Check if any skip label appears within ±3000 chars of this env
        context_slice = content[max(0, start-200):start+3000]
        skip_this = any(lbl in context_slice for lbl in skip_labels)

        end = content.find(end_tag, start)
        if end == -1:
            result.append(content[pos:])
            break
        end += len(end_tag)

        before = content[pos:start]
        inner  = content[start:end]

        if skip_this:
            result.append(before)
            result.append(inner)
        else:
            result.append(before)
            result.append('\\resizebox{\\linewidth}{!}{%\n')
            result.append(inner)
            result.append('\n}%')
        pos = end

    return ''.join(result)

# ── 1. wrap ganttchart ───────────────────────────────────────────────────────
content = wrap_env(content, r'\begin{ganttchart}', r'\end{ganttchart}')

# ── 2. wrap tikzpictures, skip deployment diagram ───────────────────────────
content = wrap_env(content, r'\begin{tikzpicture}', r'\end{tikzpicture}',
                   skip_labels=['fig:deployment'])

# ── 3. rewrite deployment diagram (flat, no nested tikzpictures) ─────────────
OLD_DEPLOY = r"""\begin{figure}[H]
\centering
\begin{tikzpicture}[
  every node/.style={font=\small\sffamily},
  zone/.style={rectangle, rounded corners=6pt, draw=#1!60, fill=#1!8,
               inner sep=8pt, minimum width=5.5cm},
  svc/.style={rectangle, rounded corners=3pt, draw=gray!50, fill=#1,
              minimum width=4.8cm, minimum height=0.7cm,
              text centered, font=\footnotesize\sffamily},
  arr/.style={-{Stealth[length=5pt]}, thick, gray!60},
  darr/.style={-{Stealth[length=5pt]}, dashed, gray!50}
]
%% Azure VM box
\node[zone=blue, label={[font=\small\bfseries\sffamily, text=blue!60]above:Azure Virtual Machine}]
  (vm) at (0,0) {
    \begin{minipage}{5cm}
      \centering
      \begin{tikzpicture}[
        svc2/.style={rectangle, rounded corners=2pt, draw=gray!40, fill=#1,
                     minimum width=4.5cm, minimum height=0.6cm,
                     text centered, font=\scriptsize\sffamily},
        node distance=0.3cm
      ]
        \node[svc2=lightblue]   (nextjs) {Next.js Server (port 3000)};
        \node[svc2=lightpurple, below=of nextjs] (n8n) {n8n (Docker, port 5678)};
        \node[svc2=lightgreen,  below=of n8n]    (fastapi) {FastAPI / uvicorn (port 8000)};
        \node[svc2=lightyellow, below=of fastapi] (socat) {socat bridge (172.17.0.1:8000)};
      \end{tikzpicture}
    \end{minipage}
  };

%% Local machine box
\node[zone=orange, right=2.5cm of vm,
      label={[font=\small\bfseries\sffamily, text=orange!70]above:Local Machine (SSH tunnel)}]
  (local) {
    \begin{minipage}{4cm}
      \centering
      \begin{tikzpicture}[
        svc2/.style={rectangle, rounded corners=2pt, draw=gray!40, fill=#1,
                     minimum width=3.7cm, minimum height=0.6cm,
                     text centered, font=\scriptsize\sffamily},
        node distance=0.3cm
      ]
        \node[svc2=lightorange] (lm) {LM Studio (port 1234)};
        \node[font=\tiny\sffamily, below=0.05cm of lm] {Qwen Embedding Model};
      \end{tikzpicture}
    \end{minipage}
  };

%% External services box
\node[zone=gray, below=1.8cm of vm,
      label={[font=\small\bfseries\sffamily, text=gray!60]below:External Cloud APIs}]
  (ext) {
    \begin{minipage}{10cm}
      \centering
      \begin{tikzpicture}[
        svc2/.style={rectangle, rounded corners=2pt, draw=gray!40, fill=lightred!60,
                     minimum width=2.2cm, minimum height=0.6cm,
                     text centered, font=\scriptsize\sffamily},
        node distance=0.4cm
      ]
        \node[svc2] (ds)  {DeepSeek API};
        \node[svc2, right=of ds] (sp)  {SerpAPI};
        \node[svc2, right=of sp] (om)  {Open-Meteo};
        \node[svc2, right=of om] (bk)  {Booking.com};
      \end{tikzpicture}
    \end{minipage}
  };

%% User browser
\node[svc=lightblue!50, above=1.5cm of vm, minimum width=5.5cm]
  (browser) {User Browser (HTTPS)};

%% Arrows
\draw[arr] (browser.south) -- (vm.north) node[midway,right,font=\tiny\sffamily]{port 3000/5678};
\draw[darr] (vm.east) -- (local.west) node[midway,above,font=\tiny\sffamily]{reverse SSH};
\draw[darr] (vm.south) -- (ext.north) node[midway,right,font=\tiny\sffamily]{HTTPS};

\end{tikzpicture}
\caption{Deployment topology: the Next.js frontend, n8n Docker container, and FastAPI microservice
         run on an Azure VM; the Qwen embedding model is served from a local machine via a reverse
         SSH tunnel; all LLM and data APIs are external cloud services.}
\label{fig:deployment}
\end{figure}"""

NEW_DEPLOY = r"""\begin{figure}[H]
\centering
\resizebox{\linewidth}{!}{%
\begin{tikzpicture}[
  every node/.style={font=\small\sffamily},
  svc/.style={rectangle, rounded corners=3pt, draw=gray!50, fill=#1,
              minimum width=4.0cm, minimum height=0.65cm,
              text centered, font=\footnotesize\sffamily},
  arr/.style={-{Stealth[length=5pt]}, thick, gray!60},
  darr/.style={-{Stealth[length=5pt]}, dashed, gray!50}
]

%% User browser
\node[svc=lightblue!60, minimum width=5cm] (browser) at (5, 10) {User Browser (HTTPS)};

%% Azure VM boundary
\draw[draw=blue!40, fill=blue!5, rounded corners=8pt, thick] (0.5,2.2) rectangle (9.5,9.0);
\node[font=\small\bfseries\sffamily, text=blue!50] at (5, 8.7) {Azure Virtual Machine};

\node[svc=lightblue]   (nextjs)  at (5, 8.0) {Next.js / Node.js \quad port 3000};
\node[svc=lightpurple] (n8ndock) at (5, 7.0) {n8n (Docker container) \quad port 5678};
\node[svc=lightgreen]  (fastapi) at (5, 6.0) {FastAPI / uvicorn \quad port 8000};
\node[svc=lightyellow] (socat)   at (5, 5.0) {socat bridge \quad 172.17.0.1:8000};
\node[svc=lightred!40] (pg)      at (5, 4.0) {PostgreSQL \quad port 5432};
\node[svc=lightred!40] (nextauth)at (5, 3.0) {NextAuth (JWT sessions)};

%% Local machine boundary
\draw[draw=orange!50, fill=orange!5, rounded corners=8pt, thick] (11.0,5.2) rectangle (16.0,8.2);
\node[font=\small\bfseries\sffamily, text=orange!60] at (13.5, 7.9) {Local Machine};
\node[svc=lightorange, minimum width=4cm] (lm) at (13.5, 7.0) {LM Studio \quad port 1234};
\node[font=\tiny\sffamily, text=gray!60] at (13.5, 6.5) {Qwen text-embedding model};
\node[svc=lightyellow, minimum width=4cm] (tunnel) at (13.5, 6.0) {Reverse SSH Tunnel};

%% External APIs boundary
\draw[draw=gray!40, fill=gray!5, rounded corners=8pt] (0.5,-1.2) rectangle (16.0,0.8);
\node[font=\small\bfseries\sffamily, text=gray!60] at (8.25, 0.55) {External Cloud APIs};
\node[svc=lightred!50, minimum width=3.2cm] (ds) at (2,   0) {DeepSeek API};
\node[svc=lightred!50, minimum width=3.2cm] (sp) at (5.7, 0) {SerpAPI};
\node[svc=lightred!50, minimum width=3.2cm] (om) at (9.4, 0) {Open-Meteo};
\node[svc=lightred!50, minimum width=3.2cm] (bk) at (13.1,0) {Booking.com};

%% Arrows
\draw[arr]  (browser)  -- (nextjs)  node[midway,right,font=\tiny\sffamily]{HTTP/S};
\draw[arr]  (nextjs)   -- (n8ndock);
\draw[arr]  (n8ndock)  -- (fastapi);
\draw[arr]  (fastapi)  -- (socat);
\draw[darr] (fastapi.east) to[out=0,in=180] (tunnel.west)
  node[midway,above,font=\tiny\sffamily]{SSH};
\draw[darr] (tunnel.north) -- (lm.south);
\draw[darr] (n8ndock.south) to[out=270,in=90]  (ds.north);
\draw[darr] (n8ndock.south) to[out=270,in=90]  (sp.north);
\draw[darr] (fastapi.south) to[out=270,in=90]  (om.north);
\draw[darr] (fastapi.south) to[out=270,in=90]  (bk.north);

\end{tikzpicture}
}%
\caption{Deployment topology: Next.js, n8n (Docker), FastAPI, and PostgreSQL run on an Azure VM;
         the Qwen embedding model is served from a local machine via a reverse SSH tunnel;
         DeepSeek, SerpAPI, Open-Meteo, and Booking.com are external cloud services.}
\label{fig:deployment}
\end{figure}"""

if OLD_DEPLOY in content:
    content = content.replace(OLD_DEPLOY, NEW_DEPLOY)
    print('Deployment diagram rewritten.')
else:
    print('WARNING: deployment diagram not found for replacement.')
    # Try to find the label to debug
    idx = content.find('fig:deployment')
    if idx != -1:
        print('Label found at position', idx)
        print('Context:', repr(content[idx-200:idx+200]))

with open(SRC, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done.')

# Verify
with open(SRC, encoding='utf-8') as f:
    c2 = f.read()
print('Total lines:', c2.count('\n'))
print('resizebox count:', c2.count(r'\resizebox'))
