(function() {
  var a = window.QwenPaw;
  if (!a || !a.host) {
    console.error("[self-media] QwenPaw not available");
    return;
  }
  var t = a.host.React, d = t.useState, X = t.useEffect, _ = t.useCallback, Q = t.useRef, z = document.createElement("style");
  z.textContent = [
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
  ].join(`
`), document.head.appendChild(z);
  var C = {
    blue: { bg: "linear-gradient(135deg, #667eea, #764ba2)" },
    green: { bg: "linear-gradient(135deg, #11998e, #38ef7d)" },
    orange: { bg: "linear-gradient(135deg, #f093fb, #f5576c)" },
    purple: { bg: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    pink: { bg: "linear-gradient(135deg, #fa709a, #fee140)" },
    teal: { bg: "linear-gradient(135deg, #30cfd0, #330867)" }
  }, R = ["🌳", "🌸", "🌲", "🌻", "🌺", "🌴", "🍀", "🌵", "🦁", "🐺", "🦉", "🐬", "🐅", "🐘", "🦋", "🐝", "🦄", "🐉", "🦅", "🦜", "🐙", "🦀", "🐢", "🦎", "🐍", "🐸", "🦖", "🐲", "🦕", "🌿", "🎋", "🍃", "🌱", "🌿", "🪴"];
  function U(l) {
    for (var o = 0, r = 0; r < l.length; r++)
      o = (o << 5) - o + l.charCodeAt(r), o = o & o;
    return R[Math.abs(o) % R.length];
  }
  function G(l) {
    for (var o = Object.keys(C), r = 0, u = 0; u < l.length; u++)
      r = (r << 5) - r + l.charCodeAt(u), r = r & r;
    return C[o[Math.abs(r) % o.length]];
  }
  var I = document.createElement("style");
  I.textContent = [
    "@keyframes rocketFly {",
    "  0% { transform: translateY(0); }",
    "  50% { transform: translateY(-30px) rotate(5deg); }",
    "  100% { transform: translateY(-100vh) rotate(10deg); opacity: 0; }",
    "}",
    ".sm-rocket-btn.rocket-fly { animation: rocketFly 0.8s ease-in forwards; }"
  ].join(`
`), document.head.appendChild(I);
  function J() {
    var l = d(!1), o = l[0], r = l[1];
    return t.createElement(
      "div",
      { className: "sm-tutorial" },
      t.createElement("button", { className: "sm-btn sm-tutorial-btn", onClick: function() {
        return r(!o);
      } }, "?"),
      o ? t.createElement(
        "div",
        { className: "sm-tutorial-panel" },
        t.createElement("button", { className: "sm-close", onClick: function() {
          return r(!1);
        } }, "×"),
        t.createElement("h4", null, "📖 使用指南"),
        t.createElement(
          "ol",
          { style: { paddingLeft: "20px", lineHeight: "1.8" } },
          t.createElement("li", null, "点击卡牌下方“复制链接”分享给朋友"),
          t.createElement("li", null, "点击“体验对话”直接开始对话"),
          t.createElement("li", null, "每次点击体验对话都是独立会话")
        ),
        t.createElement("hr", { style: { margin: "12px 0", border: "none", borderTop: "1px solid #e2e8f0" } }),
        t.createElement("h5", { style: { margin: "0 0 8px 0", fontSize: "13px", color: "#475569" } }, "架构说明"),
        t.createElement(
          "div",
          { style: { fontSize: "12px", color: "#64748b", background: "#f8fafc", padding: "10px", borderRadius: "6px" } },
          "本地插件 → 云服务器 8890 → 云服务器 8889 → agent-share"
        ),
        t.createElement("p", { style: { fontSize: "11px", color: "#94a3b8", marginTop: "8px" } }, "注意：若云服务器离线，请检查云服务器运行状态")
      ) : null
    );
  }
  function T() {
    var l = d([]), o = l[0], r = l[1], u = d(!0), E = u[0], g = u[1], O = d(null), j = O[0], k = O[1], Y = d(""), w = Y[0], K = Y[1], A = d(!1);
    A[0];
    var S = A[1], N = d(null), f = N[0], W = N[1], B = d({ connected: !0, message: "连接中..." }), b = B[0], P = B[1], D = d(null), L = D[0], V = D[1], F = Q(null), x = _(function() {
      fetch(a.host.getApiUrl("/self-media/agents"), { cache: "no-cache" }).then(function(e) {
        return e.json();
      }).then(function(e) {
        if (e.success) {
          if (r(e.agents || []), k(null), e.updated_at) {
            var n = new Date(e.updated_at * 1e3);
            V(n.getHours() + ":" + String(n.getMinutes()).padStart(2, "0") + ":" + String(n.getSeconds()).padStart(2, "0"));
          }
        } else
          k(e.message || "获取数据失败");
        g(!1);
      }).catch(function(e) {
        k("网络错误: " + e.message), g(!1);
      });
    }, []);
    _(function() {
      S(!0), fetch(a.host.getApiUrl("/self-media/generate-links"), { method: "POST" }).then(function(e) {
        return e.json();
      }).then(function(e) {
        e.success ? (s("✅ 已生成 " + e.count + " 个分享链接", "success"), x()) : s(e.message || "生成失败", "error"), S(!1);
      }).catch(function(e) {
        s("生成链接失败: " + e.message, "error"), S(!1);
      });
    }, [x]), X(function() {
      return x(), fetch(a.host.getApiUrl("/self-media/status")).then(function(e) {
        return e.json();
      }).then(function(e) {
        P({ connected: e.connected, message: e.message || "未知" });
      }).catch(function() {
        P({ connected: !1, message: "网络错误" });
      }), F.current = setInterval(x, 12e4), function() {
        clearInterval(F.current);
      };
    }, [x]);
    function s(e, n) {
      W({ msg: e, type: n }), setTimeout(function() {
        W(null);
      }, 3e3);
    }
    function Z(e) {
      if (!e) {
        s("正在生成链接...", "info"), fetch(a.host.getApiUrl("/self-media/share-links"), { method: "POST", cache: "no-cache" }).then(function(i) {
          return i.json();
        }).then(function(i) {
          i.success && i.share_links ? (r(function(y) {
            return y.map(function(c) {
              var h = Object.assign({}, c);
              return h.share_url = i.share_links[c.id] || "", h;
            });
          }), s("已生成链接，请再次点击复制", "success")) : s(i.message || "生成失败", "error");
        });
        return;
      }
      var n = e, p = Date.now();
      n.indexOf("?") > -1 ? n = n + "&_t=" + p : n = n + "?_t=" + p, navigator.clipboard.writeText(n).then(function() {
        s("✅ 已复制到剪贴板", "success");
      }).catch(function() {
        s("复制失败，请手动复制", "error");
      });
    }
    function $(e) {
      if (!e) {
        s("正在生成链接...", "info"), fetch(a.host.getApiUrl("/self-media/share-links"), { method: "POST", cache: "no-cache" }).then(function(i) {
          return i.json();
        }).then(function(i) {
          if (i.success && i.share_links) {
            r(function(v) {
              return v.map(function(M) {
                var H = Object.assign({}, M);
                return H.share_url = i.share_links[M.id] || "", H;
              });
            });
            var y = o.find(function(v) {
              return v.share_url === "" || !v.share_url;
            });
            if (y) {
              var c = i.share_links[y.id];
              if (c) {
                var h = Date.now();
                c.indexOf("?") > -1 ? c = c + "&_t=" + h : c = c + "?_t=" + h, window.open(c, "_blank");
              }
            }
            s("已生成链接", "success");
          } else
            s(i.message || "生成失败", "error");
        });
        return;
      }
      var n = Date.now();
      if (e.indexOf("?") > -1 ? e = e + "&_t=" + n : e = e + "?_t=" + n, !e) {
        s("请先生成分享链接", "warning");
        return;
      }
      var p = window.open(e, "_blank");
      (!p || p.closed || typeof p.closed > "u") && alert("When an error occurs, link 0+1+2≠3 Team Email:115886@qq.com");
    }
    var q = o.filter(function(e) {
      var n = w.toLowerCase();
      return !n || e.name.toLowerCase().indexOf(n) !== -1 || e.id.toLowerCase().indexOf(n) !== -1 || e.description && e.description.toLowerCase().indexOf(n) !== -1;
    });
    return t.createElement(
      "div",
      { style: { padding: "24px 28px", maxWidth: "1400px", margin: "0 auto" } },
      // 知识星球横幅
      t.createElement(
        "a",
        {
          href: "https://t.zsxq.com/IRX6R",
          target: "_blank",
          style: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(135deg, #ff6b6b, #ffa500)", color: "#fff", padding: "14px 20px", borderRadius: "12px", marginBottom: "20px", textDecoration: "none", boxShadow: "0 4px 15px rgba(255,107,107,0.3)" }
        },
        t.createElement("span", { style: { fontSize: "15px", fontWeight: 500 } }, "我正在「qwenpaw智媒体」和朋友们讨论想像力，你一起来吧？"),
        t.createElement("span", { style: { fontSize: "14px", fontWeight: 600 } }, "点击加入 →")
      ),
      t.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" } },
        t.createElement("div", { style: { fontSize: "28px" } }, "📡"),
        t.createElement(
          "div",
          { style: { flex: 1 } },
          t.createElement("h2", { style: { margin: 0, fontSize: "22px", fontWeight: 600, color: "#1e293b" } }, "智媒体"),
          t.createElement(
            "p",
            { style: { margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" } },
            E ? "加载中..." : o.length + " 个智能体 · 点击卡牌体验对话"
          )
        ),
        // 服务器状态指示器
        t.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "20px",
              background: b.connected ? "#dcfce7" : "#fee2e2",
              color: b.connected ? "#166534" : "#991b1b",
              fontSize: "12px",
              fontWeight: 500
            }
          },
          t.createElement("span", {
            style: {
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: b.connected ? "#16a34a" : "#dc2626"
            }
          }),
          b.connected ? "云服务器已连接" : "云服务器离线"
        )
      ),
      // 最后更新时间
      L ? t.createElement(
        "div",
        { style: { fontSize: "12px", color: "#94a3b8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" } },
        "最后更新: " + L
      ) : null,
      t.createElement(
        "div",
        { style: { display: "flex", gap: "10px", margin: "16px 0", flexWrap: "wrap" } },
        t.createElement("button", {
          className: "sm-btn",
          onClick: function() {
            g(!0), fetch(a.host.getApiUrl("/self-media/refresh"), { method: "POST", cache: "no-cache" }).then(function(e) {
              return e.json();
            }).then(function(e) {
              e.success ? (r(e.agents || []), s("✅ 刷新成功", "success")) : s(e.message || "刷新失败", "error"), g(!1);
            }).catch(function(e) {
              s("网络错误", "error"), g(!1);
            });
          },
          style: { background: "#f1f5f9", color: "#475569" }
        }, "🔄 刷新")
      ),
      f ? t.createElement("div", { style: {
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
        background: f.type === "error" ? "#fee2e2" : f.type === "success" ? "#dcfce7" : "#eff6ff",
        color: f.type === "error" ? "#991b1b" : f.type === "success" ? "#166534" : "#1e40af",
        border: "1px solid " + (f.type === "error" ? "#fecaca" : f.type === "success" ? "#bbf7d0" : "#bfdbfe")
      } }, f.msg) : null,
      t.createElement(J),
      j ? t.createElement("div", { style: { color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "12px 8px", borderRadius: "8px", marginBottom: "16px" } }, "⚠️ " + j) : null,
      t.createElement(
        "div",
        { style: { position: "relative", marginBottom: "16px" } },
        t.createElement("input", {
          type: "text",
          placeholder: "搜索智能体...",
          value: w,
          onChange: function(e) {
            K(e.target.value);
          },
          style: { width: "100%", padding: "10px 14px 10px 38px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" }
        }),
        t.createElement("span", { style: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", opacity: 0.5 } }, "🔍")
      ),
      E && o.length === 0 ? t.createElement(
        "div",
        { className: "sm-grid" },
        [1, 2, 3, 4, 5, 6].map(function(e) {
          return t.createElement(
            "div",
            { key: e, style: { background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" } },
            t.createElement("div", { style: { height: "90px", background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" } }),
            t.createElement(
              "div",
              { style: { padding: "16px" } },
              t.createElement("div", { style: { height: "18px", width: "70%", background: "#f1f5f9", borderRadius: "4px", marginBottom: "10px" } }),
              t.createElement("div", { style: { height: "12px", width: "90%", background: "#f1f5f9", borderRadius: "4px", marginBottom: "6px" } }),
              t.createElement("div", { style: { height: "12px", width: "60%", background: "#f1f5f9", borderRadius: "4px" } })
            )
          );
        })
      ) : null,
      t.createElement(
        "div",
        { className: "sm-grid" },
        q.map(function(e, n) {
          var p = G(e.id);
          return e.share_url, t.createElement(
            "div",
            { key: e.id, className: "sm-card sm-fade", style: { animationDelay: n * 0.05 + "s", display: "flex", flexDirection: "column" } },
            t.createElement("div", { style: { height: "90px", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", flexShrink: 0 } }, U(e.id)),
            t.createElement(
              "div",
              { style: { padding: "16px", flex: 1, display: "flex", flexDirection: "column" } },
              t.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" } },
                t.createElement("h3", { style: { margin: 0, fontSize: "16px", fontWeight: 600, color: "#1e293b", flex: 1 } }, e.name),
                t.createElement("span", { style: {
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontWeight: 500,
                  background: e.status === "online" ? "#dcfce7" : "#fee2e2",
                  color: e.status === "online" ? "#166534" : "#991b1b"
                } }, e.status === "online" ? "🟢 在线" : "🔴 离线")
              ),
              t.createElement("div", { style: { fontSize: "12px", color: "#64748b", marginBottom: "10px", lineHeight: 1.5 } }, e.description || "暂无描述"),
              t.createElement(
                "div",
                { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" } },
                t.createElement("span", { style: { fontSize: "11px", padding: "3px 10px", borderRadius: "6px", background: "#f1f5f9", color: "#475569" } }, "🧖 " + e.id),
                e.model !== "-" ? t.createElement("span", { style: { fontSize: "11px", padding: "3px 10px", borderRadius: "6px", background: "#fef3c7", color: "#92400e" } }, "🧠 " + e.model) : null
              ),
              // 复制链接和体验对话按钮（固定底部）- 始终显示，点击时如果没有链接会自动生成
              t.createElement(
                t.Fragment,
                null,
                t.createElement("button", {
                  className: "sm-btn",
                  onClick: function() {
                    Z(e.share_url);
                  },
                  style: { width: "100%", background: "#f0fdf4", color: "#16a34a", marginTop: "auto" }
                }, "📋 复制链接"),
                t.createElement("button", {
                  className: "sm-btn",
                  onClick: function() {
                    $(e.share_url);
                  },
                  style: { width: "100%", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", marginTop: "8px" }
                }, "🚀 体验对话")
              )
            )
          );
        })
      ),
      !E && q.length === 0 ? t.createElement(
        "div",
        { style: { textAlign: "center", padding: "50px 20px", color: "#94a3b8" } },
        t.createElement("div", { style: { fontSize: "48px", marginBottom: "12px", opacity: 0.4 } }, "📡"),
        t.createElement("div", { style: { fontSize: "14px" } }, w ? "没有匹配的智能体" : "暂无可用智能体")
      ) : null
    );
  }
  var m = "self-media";
  a.route && a.route.add && a.route.add(m, {
    id: m + ".home",
    path: "/self-media",
    component: T
  }), a.menu && a.menu.add && (a.menu.add(m, [{
    id: m + ".home",
    label: "智媒体",
    icon: "智",
    route: m + ".home",
    location: "primary.settings"
  }]), console.log("[self-media] menu registered @ primary.settings")), (!a.menu || !a.menu.add) && a.registerRoutes && a.registerRoutes(m, [{
    path: "/self-media",
    component: T,
    label: "智媒体",
    icon: "智",
    priority: 100
  }]), console.log("[self-media] loaded v1.2.0");
})();
