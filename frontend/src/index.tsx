// @ts-nocheck
(function () {
  var QP = window.QwenPaw;
  if (!QP || !QP.host) {
    console.error("[self-media] QwenPaw not available");
    return;
  }
  var React = QP.host.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useCallback = React.useCallback;
  var useRef = React.useRef;

  // ====== 样式 ======
  var css = document.createElement("style");
  css.textContent = [
    "@keyframes smFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }",
    "@keyframes smPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }",
    "@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }",
    "@keyframes smSlideIn { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }",
    ".sm-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: all 0.25s ease; overflow: hidden; }",
    ".sm-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }",
    ".sm-fade { animation: smFadeIn 0.4s ease forwards; opacity: 0; }",
    ".sm-btn { border: none; border-radius: 8px; padding: 10px 16px; fontSize: 13px; fontWeight: 500; cursor: pointer; transition: all 0.2s; }",
    ".sm-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }",
    ".sm-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }",
    ".sm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }",
    "@media (max-width: 640px) { .sm-grid { grid-template-columns: 1fr; } }",
    ".sm-tutorial { position: fixed; top: 20px; right: 20px; z-index: 9999; }",
    ".sm-tutorial-btn { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; border: none; cursor: pointer; font-size: 16px; font-weight: 600; box-shadow: 0 2px 8px rgba(102,126,234,0.4); transition: all 0.2s; }",
    ".sm-tutorial-btn:hover { transform: scale(1.1); box-shadow: 0 4px 16px rgba(102,126,234,0.5); }",
    ".sm-tutorial-panel { position: absolute; top: 44px; right: 0; width: 320px; background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); padding: 20px; font-size: 13px; line-height: 1.6; }",
    ".sm-tutorial-panel h4 { margin: 0 0 12px 0; color: #1e293b; font-size: 14px; }",
    ".sm-tutorial-panel ol { margin: 0; padding-left: 16px; color: #475569; }",
    ".sm-tutorial-panel li { margin-bottom: 8px; }",
    ".sm-close { position: absolute; top: 8px; right: 12px; background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; }",
    "@keyframes rocketFly { 0% {transform: translateY(0)} 50% {transform: translateY(-30px) rotate(5deg)} 100% {transform: translateY(-100vh) rotate(10deg); opacity: 0} }",
    ".sm-rocket-btn.rocket-fly { animation: rocketFly 0.8s ease-in forwards; }"
  ].join("\n");
  document.head.appendChild(css);

  // ====== 主题配色 ======
  var THEMES = {
    blue: { bg: "linear-gradient(135deg, #667eea, #764ba2)" },
    green: { bg: "linear-gradient(135deg, #11998e, #38ef7d)" },
    orange: { bg: "linear-gradient(135deg, #f093fb, #f5576c)" },
    purple: { bg: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    pink: { bg: "linear-gradient(135deg, #fa709a, #fee140)" },
    teal: { bg: "linear-gradient(135deg, #30cfd0, #330867)" }
  };
  var ICONS = ["🌳","🌸","🌲","🌻","🌺","🌴","🍀","🌵","🦁","🐺","🦉","🐬","🐅","🐘","🦋","🐝","🦄","🐉","🦅","🦜","🐙","🦀","🐢","🦎","🐍","🐸","🦖","🐲","🦕","🌿","🎋","🍃","🌱","🌿","🪴"];
  function getAgentIcon(id) {
    var hash = 0;
    for (var i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash;
    }
    return ICONS[Math.abs(hash) % ICONS.length];
  }
  function getTheme(id) {
    var themes = Object.keys(THEMES);
    var hash = 0;
    for (var i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash;
    }
    return THEMES[themes[Math.abs(hash) % themes.length]];
  }

  // 火箭动画样式
  var rocketCss = document.createElement("style");
  rocketCss.textContent = [
    "@keyframes rocketFly {",
    "  0% { transform: translateY(0); }",
    "  50% { transform: translateY(-30px) rotate(5deg); }",
    "  100% { transform: translateY(-100vh) rotate(10deg); opacity: 0; }",
    "}",
    ".sm-rocket-btn.rocket-fly { animation: rocketFly 0.8s ease-in forwards; }"
  ].join("\n");
  document.head.appendChild(rocketCss);

  // ====== 教学面板 ======
  function TutorialPanel() {
    var _a = useState(false), open = _a[0], setOpen = _a[1];
    return React.createElement("div", { className: "sm-tutorial" },
      React.createElement("button", { className: "sm-btn sm-tutorial-btn", onClick: function () { return setOpen(!open); } }, "?"),
      open ? React.createElement("div", { className: "sm-tutorial-panel" },
        React.createElement("button", { className: "sm-close", onClick: function () { return setOpen(false); } }, "×"),
        React.createElement("h4", null, "\ud83d\udcd6 \u4f7f\u7528\u6307\u5357"),
        React.createElement("ol", { style: { paddingLeft: "20px", lineHeight: "1.8" } },
          React.createElement("li", null, "\u70b9\u51fb\u5361\u724c\u4e0b\u65b9\u201c\u590d\u5236\u94fe\u63a5\u201d\u5206\u4eab\u7ed9\u670b\u53cb"),
          React.createElement("li", null, "\u70b9\u51fb\u201c\u4f53\u9a8c\u5bf9\u8bdd\u201d\u76f4\u63a5\u5f00\u59cb\u5bf9\u8bdd"),
          React.createElement("li", null, "\u6bcf\u6b21\u70b9\u51fb\u4f53\u9a8c\u5bf9\u8bdd\u90fd\u662f\u72ec\u7acb\u4f1a\u8bdd")
        ),
        React.createElement("hr", { style: { margin: "12px 0", border: "none", borderTop: "1px solid #e2e8f0" } }),
        React.createElement("h5", { style: { margin: "0 0 8px 0", fontSize: "13px", color: "#475569" } }, "\u67b6\u6784\u8bf4\u660e"),
        React.createElement("div", { style: { fontSize: "12px", color: "#64748b", background: "#f8fafc", padding: "10px", borderRadius: "6px" } },
          "\u672c\u5730\u63d2\u4ef6 \u2192 \u4e91\u670d\u52a1\u5668 8890 \u2192 \u4e91\u670d\u52a1\u5668 8889 \u2192 agent-share"
        ),
        React.createElement("p", { style: { fontSize: "11px", color: "#94a3b8", marginTop: "8px" } }, "\u6ce8\u610f\uff1a\u82e5\u4e91\u670d\u52a1\u5668\u79bb\u7ebf\uff0c\u8bf7\u68c0\u67e5\u4e91\u670d\u52a1\u5668\u8fd0\u884c\u72b6\u6001")
      ) : null
    );
  }

  // ====== 主页面 ======
  function SelfMediaPage() {
    var _a = useState([]), agents = _a[0], setAgents = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(""), search = _d[0], setSearch = _d[1];
    var _e = useState(false), generating = _e[0], setGenerating = _e[1];
    var _f = useState(null), toast = _f[0], setToast = _f[1];
    var _g = useState({ connected: true, message: "连接中..." }), serverStatus = _g[0], setServerStatus = _g[1];
    var _h = useState(null), lastUpdate = _h[0], setLastUpdate = _h[1];
    var timer = useRef(null);

    var fetchData = useCallback(function () {
      fetch(QP.host.getApiUrl("/self-media/agents"), { cache: "no-cache" })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) {
            setAgents(d.agents || []);
            setError(null);
            // 设置最后更新时间
            if (d.updated_at) {
              var date = new Date(d.updated_at * 1000);
              setLastUpdate(date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0"));
            }
          } else {
            setError(d.message || "\u83b7\u53d6\u6570\u636e\u5931\u8d25");
          }
          setLoading(false);
        })
        .catch(function (e) {
          setError("\u7f51\u7edc\u9519\u8bef: " + e.message);
          setLoading(false);
        });
    }, []);

    var generateLinks = useCallback(function () {
      setGenerating(true);
      fetch(QP.host.getApiUrl("/self-media/generate-links"), { method: "POST" })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) {
            showToast("\u2705 \u5df2\u751f\u6210 " + d.count + " \u4e2a\u5206\u4eab\u94fe\u63a5", "success");
            fetchData();
          } else {
            showToast(d.message || "\u751f\u6210\u5931\u8d25", "error");
          }
          setGenerating(false);
        })
        .catch(function (e) {
          showToast("\u751f\u6210\u94fe\u63a5\u5931\u8d25: " + e.message, "error");
          setGenerating(false);
        });
    }, [fetchData]);

    useEffect(function () {
      fetchData();
      // 检查服务器状态
      fetch(QP.host.getApiUrl("/self-media/status"))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          setServerStatus({ connected: d.connected, message: d.message || "未知" });
        })
        .catch(function () {
          setServerStatus({ connected: false, message: "网络错误" });
        });
      
      // 自动刷新（每5分钟）
      timer.current = setInterval(fetchData, 120000);
      return function () { clearInterval(timer.current); };
    }, [fetchData]);

    function showToast(msg, type) {
      setToast({ msg: msg, type: type });
      setTimeout(function () { setToast(null); }, 3000);
    }

    function copyText(text) {
      // 如果没有链接，先生成
      if (!text) {
        showToast("\u6b63\u5728\u751f\u6210\u94fe\u63a5...", "info");
        fetch(QP.host.getApiUrl("/self-media/share-links"), { method: "POST", cache: "no-cache" })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d.success && d.share_links) {
              // 更新所有 agent 的 share_url
              setAgents(function (prev) {
                return prev.map(function (ag) {
                  var newAg = Object.assign({}, ag);
                  newAg.share_url = d.share_links[ag.id] || "";
                  return newAg;
                });
              });
              showToast("\u5df2\u751f\u6210\u94fe\u63a5\uff0c\u8bf7\u518d\u6b21\u70b9\u51fb\u590d\u5236", "success");
            } else {
              showToast(d.message || "\u751f\u6210\u5931\u8d25", "error");
            }
          });
        return;
      }
      // 每次复制都添加时间戳，确保是新会话
      var url = text;
      var timestamp = Date.now();
      if (url.indexOf("?") > -1) {
        url = url + "&_t=" + timestamp;
      } else {
        url = url + "?_t=" + timestamp;
      }
      navigator.clipboard.writeText(url).then(function () {
        showToast("\u2705 \u5df2\u590d\u5236\u5230\u526a\u8d34\u677f", "success");
      }).catch(function () {
        showToast("\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u624b\u52a8\u590d\u5236", "error");
      });
    }

    function openChat(url) {
      // 如果没有链接，先生成
      if (!url) {
        showToast("\u6b63\u5728\u751f\u6210\u94fe\u63a5...", "info");
        fetch(QP.host.getApiUrl("/self-media/share-links"), { method: "POST", cache: "no-cache" })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d.success && d.share_links) {
              // 更新所有 agent 的 share_url
              setAgents(function (prev) {
                return prev.map(function (ag) {
                  var newAg = Object.assign({}, ag);
                  newAg.share_url = d.share_links[ag.id] || "";
                  return newAg;
                });
              });
              // 获取当前 agent 的新链接并打开
              var currentAgent = agents.find(function (a) { return a.share_url === "" || !a.share_url; });
              if (currentAgent) {
                var newUrl = d.share_links[currentAgent.id];
                if (newUrl) {
                  var timestamp = Date.now();
                  if (newUrl.indexOf("?") > -1) {
                    newUrl = newUrl + "&_t=" + timestamp;
                  } else {
                    newUrl = newUrl + "?_t=" + timestamp;
                  }
                  window.open(newUrl, "_blank");
                }
              }
              showToast("\u5df2\u751f\u6210\u94fe\u63a5", "success");
            } else {
              showToast(d.message || "\u751f\u6210\u5931\u8d25", "error");
            }
          });
        return;
      }
      // 每次打开都添加时间戳，确保是新会话
      var timestamp = Date.now();
      if (url.indexOf("?") > -1) {
        url = url + "&_t=" + timestamp;
      } else {
        url = url + "?_t=" + timestamp;
      }
      if (!url) {
        showToast("\u8bf7\u5148\u751f\u6210\u5206\u4eab\u94fe\u63a5", "warning");
        return;
      }
      var w = window.open(url, "_blank");
      if (!w || w.closed || typeof w.closed === "undefined") {
        alert("When an error occurs, link 0+1+2\u22603 Team Email:115886@qq.com");
      }
    }

    var filtered = agents.filter(function (a) {
      var q = search.toLowerCase();
      return !q || a.name.toLowerCase().indexOf(q) !== -1 || a.id.toLowerCase().indexOf(q) !== -1 || (a.description && a.description.toLowerCase().indexOf(q) !== -1);
    });

    return React.createElement("div", { style: { padding: "24px 28px", maxWidth: "1400px", margin: "0 auto" } },
      // 知识星球横幅
      React.createElement("a", {
        href: "https://t.zsxq.com/IRX6R",
        target: "_blank",
        style: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg, #ff6b6b, #ffa500)", color: "#fff", padding: "14px 20px", borderRadius: "12px", marginBottom: "20px", textDecoration: "none", boxShadow: "0 4px 15px rgba(255,107,107,0.3)" }
      },
        React.createElement("span", { style: { fontSize: "15px", fontWeight: 500 } }, "\u6211\u6b63\u5728\u300cqwenpaw\u667a\u5a92\u4f53\u300d\u548c\u670b\u53cb\u4eec\u8ba8\u8bba\u60f3\u50cf\u529b\uff0c\u4f60\u4e00\u8d77\u6765\u5427\uff1f"),
        React.createElement("span", { style: { fontSize: "14px", fontWeight: 600 } }, "\u70b9\u51fb\u52a0\u5165 \u2192")
      ),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" } },
        React.createElement("div", { style: { fontSize: "28px" } }, "\ud83d\udce1"),
        React.createElement("div", { style: { flex: 1 } },
          React.createElement("h2", { style: { margin: 0, fontSize: "22px", fontWeight: 600, color: "#1e293b" } }, "\u667a\u5a92\u4f53"),
          React.createElement("p", { style: { margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" } },
            loading ? "\u52a0\u8f7d\u4e2d..." : agents.length + " \u4e2a\u667a\u80fd\u4f53 \u00b7 \u70b9\u51fb\u5361\u724c\u4f53\u9a8c\u5bf9\u8bdd"
          )
        ),
        // 服务器状态指示器
        React.createElement("div", { 
          style: { 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            padding: "6px 12px", 
            borderRadius: "20px", 
            background: serverStatus.connected ? "#dcfce7" : "#fee2e2",
            color: serverStatus.connected ? "#166534" : "#991b1b",
            fontSize: "12px",
            fontWeight: 500
          } 
        },
          React.createElement("span", { 
            style: { 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              background: serverStatus.connected ? "#16a34a" : "#dc2626" 
            } 
          }),
          serverStatus.connected ? "\u4e91\u670d\u52a1\u5668\u5df2\u8fde\u63a5" : "\u4e91\u670d\u52a1\u5668\u79bb\u7ebf"
        )
      ),
      // 最后更新时间
      lastUpdate ? React.createElement("div", { style: { fontSize: "12px", color: "#94a3b8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" } },
        "\u6700\u540e\u66f4\u65b0: " + lastUpdate
      ) : null,
      React.createElement("div", { style: { display: "flex", gap: "10px", margin: "16px 0", flexWrap: "wrap" } },
        React.createElement("button", {
          className: "sm-btn",
          onClick: function() { 
            setLoading(true); 
            fetch(QP.host.getApiUrl("/self-media/refresh"), { method: "POST", cache: "no-cache" })
              .then(function(r) { return r.json(); })
              .then(function(d) {
                if (d.success) {
                  setAgents(d.agents || []);
                  showToast("\u2705 \u5237\u65b0\u6210\u529f", "success");
                } else {
                  showToast(d.message || "\u5237\u65b0\u5931\u8d25", "error");
                }
                setLoading(false);
              })
              .catch(function(e) {
                showToast("\u7f51\u7edc\u9519\u8bef", "error");
                setLoading(false);
              });
          },
          style: { background: "#f1f5f9", color: "#475569" }
        }, "\ud83d\udd04 \u5237\u65b0")
      ),
      toast ? React.createElement("div", { style: { 
        position: "fixed", 
        top: "80px", 
        left: "50%", 
        transform: "translateX(-50%)", 
        zIndex: 9999, 
        padding: "14px 24px", 
        borderRadius: "10px", 
        fontSize: "14px", 
        fontWeight: 600,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        animation: "smSlideIn 0.3s ease",
        background: toast.type === "error" ? "#fee2e2" : toast.type === "success" ? "#dcfce7" : "#eff6ff",
        color: toast.type === "error" ? "#991b1b" : toast.type === "success" ? "#166534" : "#1e40af",
        border: "1px solid " + (toast.type === "error" ? "#fecaca" : toast.type === "success" ? "#bbf7d0" : "#bfdbfe")
      } }, toast.msg) : null,
      React.createElement(TutorialPanel),
      error ? React.createElement("div", { style: { color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "12px 8px", borderRadius: "8px", marginBottom: "16px" } }, "\u26a0\ufe0f " + error) : null,
      React.createElement("div", { style: { position: "relative", marginBottom: "16px" } },
        React.createElement("input", { type: "text", placeholder: "\u641c\u7d22\u667a\u80fd\u4f53...", value: search, onChange: function (e) { setSearch(e.target.value); },
          style: { width: "100%", padding: "10px 14px 10px 38px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" }
        }),
        React.createElement("span", { style: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", opacity: 0.5 } }, "\ud83d\udd0d")
      ),
      loading && agents.length === 0 ? 
      React.createElement("div", { className: "sm-grid" },
        [1,2,3,4,5,6].map(function(i) {
          return React.createElement("div", { key: i, style: { background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" } },
            React.createElement("div", { style: { height: "90px", background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" } }),
            React.createElement("div", { style: { padding: "16px" } },
              React.createElement("div", { style: { height: "18px", width: "70%", background: "#f1f5f9", borderRadius: "4px", marginBottom: "10px" } }),
              React.createElement("div", { style: { height: "12px", width: "90%", background: "#f1f5f9", borderRadius: "4px", marginBottom: "6px" } }),
              React.createElement("div", { style: { height: "12px", width: "60%", background: "#f1f5f9", borderRadius: "4px" } })
            )
          );
        })
      ) : null,
      React.createElement("div", { className: "sm-grid" },
        filtered.map(function (ag, idx) {
          var t = getTheme(ag.id);
          var hasLink = !!ag.share_url;
          return React.createElement("div", { key: ag.id, className: "sm-card sm-fade", style: { animationDelay: (idx * 0.05) + "s", display: "flex", flexDirection: "column" } },
            React.createElement("div", { style: { height: "90px", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", flexShrink: 0 } }, getAgentIcon(ag.id)),
            React.createElement("div", { style: { padding: "16px", flex: 1, display: "flex", flexDirection: "column" } },
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" } },
                React.createElement("h3", { style: { margin: 0, fontSize: "16px", fontWeight: 600, color: "#1e293b", flex: 1 } }, ag.name),
                React.createElement("span", { style: { fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                  background: ag.status === "online" ? "#dcfce7" : "#fee2e2",
                  color: ag.status === "online" ? "#166534" : "#991b1b"
                } }, ag.status === "online" ? "\ud83d\udfe2 \u5728\u7ebf" : "\ud83d\udd34 \u79bb\u7ebf")
              ),
              React.createElement("div", { style: { fontSize: "12px", color: "#64748b", marginBottom: "10px", lineHeight: 1.5 } }, ag.description || "\u6682\u65e0\u63cf\u8ff0"),
              React.createElement("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" } },
                React.createElement("span", { style: { fontSize: "11px", padding: "3px 10px", borderRadius: "6px", background: "#f1f5f9", color: "#475569" } }, "\ud83e\uddd6 " + ag.id),
                ag.model !== "-" ? React.createElement("span", { style: { fontSize: "11px", padding: "3px 10px", borderRadius: "6px", background: "#fef3c7", color: "#92400e" } }, "\ud83e\udde0 " + ag.model) : null
              ),
              // 复制链接和体验对话按钮（固定底部）- 始终显示，点击时如果没有链接会自动生成
              React.createElement(React.Fragment, null,
                React.createElement("button", {
                  className: "sm-btn",
                  onClick: function () { copyText(ag.share_url); },
                  style: { width: "100%", background: "#f0fdf4", color: "#16a34a", marginTop: "auto" }
                }, "\ud83d\udccb \u590d\u5236\u94fe\u63a5"),
                React.createElement("button", {
                  className: "sm-btn",
                  onClick: function () { openChat(ag.share_url); },
                  style: { width: "100%", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", marginTop: "8px" }
                }, "\ud83d\ude80 \u4f53\u9a8c\u5bf9\u8bdd")
              )
            )
          );
        })
      ),
      !loading && filtered.length === 0 ? React.createElement("div", { style: { textAlign: "center", padding: "50px 20px", color: "#94a3b8" } },
        React.createElement("div", { style: { fontSize: "48px", marginBottom: "12px", opacity: 0.4 } }, "\ud83d\udce1"),
        React.createElement("div", { style: { fontSize: "14px" } }, search ? "\u6ca1\u6709\u5339\u914d\u7684\u667a\u80fd\u4f53" : "\u6682\u65e0\u53ef\u7528\u667a\u80fd\u4f53")
      ) : null
    );
  }

  // 注册路由和菜单 - 参照 chuanmen 工作模式
  var PLUGIN_ID = "self-media";

  // 注册页面路由
  if (QP.route && QP.route.add) {
    QP.route.add(PLUGIN_ID, {
      id: PLUGIN_ID + ".home",
      path: "/self-media",
      component: SelfMediaPage
    });
  }

  // 注册侧边栏菜单（传数组，设置 location 到 settings）
  if (QP.menu && QP.menu.add) {
    QP.menu.add(PLUGIN_ID, [{
      id: PLUGIN_ID + ".home",
      label: "\u667a\u5a92\u4f53",
      icon: "\u667a",
      route: PLUGIN_ID + ".home",
      location: "primary.settings"
    }]);
    console.log("[self-media] menu registered @ primary.settings");
  }

  // 兼容旧版 API 回退
  if (!QP.menu || !QP.menu.add) {
    if (QP.registerRoutes) {
      QP.registerRoutes(PLUGIN_ID, [{
        path: "/self-media",
        component: SelfMediaPage,
        label: "\u667a\u5a92\u4f53",
        icon: "\u667a",
        priority: 100
      }]);
    }
  }

  console.log("[self-media] loaded v1.2.0");
})();
