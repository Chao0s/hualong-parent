/* ========== 通用交互 ========== */

function bindTabs() {
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const buttons = root.querySelectorAll("[data-tab]");
    const panels = document.querySelectorAll(`[data-tab-panel-group="${root.dataset.tabs}"]`);
    const apply = (target) => {
      buttons.forEach((item) => item.classList.toggle("active", item.dataset.tab === target));
      panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.tabPanel === target));
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        apply(button.dataset.tab);
      });
    });

    const initial = new URLSearchParams(window.location.search).get("tab");
    if (initial && root.querySelector(`[data-tab="${initial}"]`)) {
      apply(initial);
    }
  });
}

function bindSelectableButtons() {
  document.querySelectorAll("[data-selectable]").forEach((group) => {
    group.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        if (!group.hasAttribute("data-multiple")) {
          group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
        }
        button.classList.toggle("active", true);
      });
    });
  });
}

/* 单组令牌筛选：data-filter-group + data-filter-target 按钮 + data-filter-item 条目 */
function bindTokenFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter-target]");
    const items = document.querySelectorAll("[data-filter-item]");
    const apply = (target) => {
      buttons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filterTarget === target);
      });
      items.forEach((item) => {
        const tokens = (item.dataset.filterItem || "").split(/\s+/);
        item.hidden = !tokens.includes(target);
      });
    };
    buttons.forEach((button) => {
      button.addEventListener("click", () => apply(button.dataset.filterTarget));
    });
  });
}

/* 多维组合筛选（全部报告页：报告人 × 类型） */
function bindMatrixFilters() {
  const groups = document.querySelectorAll("[data-report-filter]");
  const items = document.querySelectorAll("[data-report-item]");
  if (!groups.length || !items.length) return;

  const active = { author: "all", type: "all" };
  const apply = () => {
    items.forEach((item) => {
      const authorMatch = active.author === "all" || item.dataset.author === active.author;
      const typeMatch = active.type === "all" || item.dataset.type === active.type;
      item.hidden = !(authorMatch && typeMatch);
    });
  };

  groups.forEach((group) => {
    const key = group.dataset.reportFilter;
    group.querySelectorAll("[data-report-filter-target]").forEach((button) => {
      button.addEventListener("click", () => {
        group.querySelectorAll("[data-report-filter-target]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        active[key] = button.dataset.reportFilterTarget;
        apply();
      });
    });
  });

  apply();
}

/* 跨入口详情页动态返回：链接带 ?from=xxx 时改写 [data-dynamic-back] 的目标 */
const BACK_TARGETS = {
  home: "../home.html",
  tasks: "evaluation-tasks.html",
  "parent-tasks": "parent-tasks.html",
  "all-reports": "all-reports.html",
  report: "evaluation-report.html",
  profile: "child-profile.html"
};

function bindDynamicBack() {
  const from = new URLSearchParams(window.location.search).get("from");
  if (!from || !BACK_TARGETS[from]) return;
  document.querySelectorAll("[data-dynamic-back]").forEach((link) => {
    link.href = BACK_TARGETS[from];
  });
}

function bindPhotoChoices() {
  document.querySelectorAll(".photo-choice input, .record-photo input").forEach((input) => {
    const picker = input.closest("[data-photo-picker]");
    const update = () => {
      input.closest(".photo-choice")?.classList.toggle("selected", input.checked);
      input.closest(".record-photo")?.classList.toggle("selected", input.checked);
      if (picker) updatePhotoCount(picker.dataset.photoPicker);
    };
    input.addEventListener("change", update);
    update();
  });
}

function bindPhotoSheets() {
  document.querySelectorAll("[data-open-photo-sheet]").forEach((button) => {
    const sheet = document.querySelector(`[data-photo-sheet="${button.dataset.openPhotoSheet}"]`);
    if (!sheet) return;
    button.addEventListener("click", () => {
      sheet.hidden = false;
    });
  });

  document.querySelectorAll("[data-close-photo-sheet]").forEach((button) => {
    const sheet = document.querySelector(`[data-photo-sheet="${button.dataset.closePhotoSheet}"]`);
    if (!sheet) return;
    button.addEventListener("click", () => {
      sheet.hidden = true;
    });
  });
}

function updatePhotoCount(id) {
  const picker = document.querySelector(`[data-photo-picker="${id}"]`);
  const output = document.querySelector(`[data-photo-count="${id}"]`);
  if (!picker || !output) return;

  const selected = picker.querySelectorAll(".photo-choice input:checked, .record-photo input:checked").length;
  output.textContent = selected ? `已选择 ${selected} 张照片` : "未选择";
}

function bindFileUploads() {
  document.querySelectorAll("[data-file-upload]").forEach((input) => {
    const output = document.querySelector(`[data-file-upload-count="${input.dataset.fileUpload}"]`);
    const update = () => {
      if (!output) return;
      const count = input.files ? input.files.length : 0;
      output.textContent = count ? `已添加 ${count} 个文件` : "未添加本机文件";
    };
    input.addEventListener("change", update);
    update();
  });
}

function bindForms() {
  document.querySelectorAll("[data-submit-demo]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.submitDemo || "已保存"));
  });
}

function bindChildSwitch() {
  const childButtons = document.querySelectorAll("[data-child-option]");
  if (!childButtons.length) return;

  const currentName = document.querySelector("[data-current-child-name]");
  const currentMeta = document.querySelector("[data-current-child-meta]");
  const currentAvatar = document.querySelector("[data-current-child-avatar]");

  childButtons.forEach((button) => {
    button.addEventListener("click", () => {
      childButtons.forEach((item) => {
        const selected = item === button;
        const status = item.querySelector("[data-child-status]");
        item.classList.toggle("selected", selected);
        if (status) {
          status.textContent = selected ? "已选中" : "切换";
          status.classList.toggle("done", selected);
        }
      });

      if (currentName) currentName.textContent = button.dataset.childName;
      if (currentMeta) currentMeta.textContent = button.dataset.childMeta;
      if (currentAvatar) currentAvatar.textContent = button.dataset.childAvatar;
      showToast(`已切换到${button.dataset.childName}`);
    });
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

/* ========== 数据 ========== */

/* 徽章配色统一：类型定色（月度=info 蓝 / 学期=warn 琥珀 / 综合=done 绿） */
const HISTORY_EVALUATIONS = {
  "monthly-05": {
    title: "历史月度",
    heading: "5 月月度评价",
    meta: "2026.05.28 提交 · 报告人：家长",
    type: "月度",
    typeClass: "info",
    copy: [
      "这个月小雨在家里更愿意主动表达自己的想法。睡前共读时，她会把故事里的角色和白天在幼儿园发生的事情联系起来，也会提醒我们一起收拾绘本。",
      "周末去社区花园时，她能主动观察植物变化，并愿意把看到的小花、小虫讲给家人听。希望下个月继续鼓励她用画画和照片记录自己的发现。"
    ],
    photos: [
      { label: "共读 1", tone: "green" },
      { label: "共读 2", tone: "green" },
      { label: "花园", tone: "blue" }
    ]
  },
  "monthly-04": {
    title: "历史月度",
    heading: "4 月月度评价",
    meta: "2026.04.26 提交 · 报告人：家长",
    type: "月度",
    typeClass: "info",
    copy: [
      "4 月小雨开始愿意尝试自己整理书包。刚开始需要家长提醒，后来可以根据第二天的活动安排，把水杯、备用衣物和绘本放到固定位置。",
      "我们发现她对“自己准备好再出门”这件事更有兴趣，也会在出发前主动检查帽子和小水壶。后续希望继续保持这种小任务，让她在日常生活里获得更多成就感。"
    ],
    photos: [
      { label: "整理", tone: "warn" },
      { label: "出发", tone: "blue" }
    ]
  },
  "teacher-monthly-05": {
    title: "教师月度评价",
    heading: "5 月教师月度评价",
    meta: "2026.05.30 推送 · 报告人：教师",
    type: "月度",
    typeClass: "info",
    copy: [
      "5 月小雨在班级活动中参与更稳定，能主动加入同伴讨论。自然角观察时，她会指认叶子的颜色和形状，并愿意把发现讲给同伴听。",
      "在集体阅读环节，小雨能够跟随故事线索回答问题。建议家庭继续保留共读后的简短复述，让孩子把在园表达经验迁移到家庭场景。"
    ],
    photos: [
      { label: "自然角", tone: "green" },
      { label: "阅读", tone: "blue" },
      { label: "分享", tone: "warn" }
    ]
  },
  "term-2025-fall": {
    title: "历史学期",
    heading: "2025 秋季学期评价",
    meta: "2026.01.12 提交 · 报告人：家长",
    type: "学期",
    typeClass: "warn",
    copy: [
      "这一学期小雨的生活自理能力有明显进步，能比较稳定地完成穿脱外套、整理餐具和睡前准备。遇到不熟悉的任务时，她会先观察家人示范，再尝试自己完成。",
      "在亲子活动中，她更愿意承担一个明确的小角色，例如给植物浇水、给奶奶介绍自己的画、和爸爸一起完成社区观察记录。我们看到她的表达更加具体，也更愿意等待别人说完再回应。",
      "下学期家里会继续提供可观察、可记录的小任务，让她通过照片、绘画和简单讲述，把自己的经历整理成更完整的表达。"
    ],
    photos: [
      { label: "自理", tone: "green" },
      { label: "观察", tone: "blue" },
      { label: "绘画", tone: "warn" },
      { label: "分享", tone: "green" }
    ]
  },
  "teacher-term-2025-fall": {
    title: "教师学期评价",
    heading: "2025 秋季教师学期评价",
    meta: "2026.01.15 推送 · 报告人：教师",
    type: "学期",
    typeClass: "warn",
    copy: [
      "本学期小雨在生活自理、同伴交往和语言表达方面均有持续进步。她能较好地适应班级一日流程，并愿意在老师提示下完成整理材料、轮流分享等任务。",
      "在主题活动中，小雨对社区观察和绘本讲述兴趣较高，能用简单句表达自己的发现。后续可继续鼓励她用照片、绘画和口述记录完整经历。"
    ],
    photos: [
      { label: "活动", tone: "green" },
      { label: "表达", tone: "blue" },
      { label: "作品", tone: "warn" }
    ]
  },
  "summary-2025": {
    title: "综合评价",
    heading: "2025 年度综合评价",
    meta: "2026.01.20 推送 · 报告人：教师",
    type: "综合",
    typeClass: "done",
    copy: [
      "综合家庭评价、教师月度观察和学期评价，小雨在表达主动性、生活自理和活动参与方面形成了较稳定的发展轨迹。",
      "下一阶段建议家园继续共同支持孩子进行真实情境观察，鼓励她把看到的、想到的和完成的事情用照片与口述记录下来。"
    ],
    domains: [
      { name: "健康", child: 4.4, cls: 4.1 },
      { name: "语言", child: 4.6, cls: 4.0 },
      { name: "社会", child: 4.2, cls: 4.2 },
      { name: "科学", child: 3.9, cls: 3.8 },
      { name: "艺术", child: 4.5, cls: 4.3 }
    ],
    photos: [
      { label: "家庭", tone: "green" },
      { label: "在园", tone: "blue" },
      { label: "成长", tone: "warn" }
    ]
  }
};

const PARENT_TASKS = {
  "community-liugengtang": {
    pageTitle: "社区任务",
    status: "待完成",
    statusClass: "warn",
    mode: "todo",
    name: "留耕堂门前的石阶",
    background: "幼儿园附近的留耕堂保留了传统建筑门楼、石阶和灰塑装饰。孩子可以从真实社区环境中观察建筑、道路和公共空间，理解生活环境与地方文化的关系。",
    detail: "请家长带幼儿在安全距离内观察留耕堂外观，拍摄一张照片或一段短视频，并请孩子说一说“这个地方和我们幼儿园有什么不同”。"
  },
  "daily-reading": {
    pageTitle: "日常亲子任务",
    status: "待完成",
    statusClass: "warn",
    mode: "todo",
    name: "周末亲子共读",
    background: "近期班级正在围绕“我会认真听”开展阅读与表达活动。亲子共读可以帮助孩子把在园阅读经验延伸到家庭情境中。",
    detail: "请家长和幼儿一起选择一本绘本完成共读，拍摄一张共读照片，并记录孩子最愿意复述的一句话。"
  },
  "history-bedtime": {
    pageTitle: "历史任务",
    status: "已完成",
    statusClass: "done",
    mode: "history",
    name: "睡前共读记录",
    share: "小雨今天选择了《好饿的毛毛虫》。她会主动翻到自己喜欢的页面，说毛毛虫吃了好多水果，还提醒妈妈读到星期六要慢一点。读完后她把绘本放回书架，说下次还想讲给外婆听。",
    photos: [
      { label: "共读 1", tone: "green" },
      { label: "共读 2", tone: "green" },
      { label: "整理", tone: "warn" }
    ]
  },
  "history-community": {
    pageTitle: "历史任务",
    status: "已完成",
    statusClass: "done",
    mode: "history",
    name: "小区里的植物朋友",
    share: "周末散步时，小雨在楼下花坛发现了新开的紫色小花。她说花瓣像小扇子，还主动提醒我们不要踩到旁边的小苗。回家后她用画笔画了花坛的位置。",
    photos: [
      { label: "观察", tone: "blue" },
      { label: "记录", tone: "green" }
    ]
  }
};

/* 过往相片素材库：来源标签对应 IA 的“亲子任务图文 / 社区任务图文” */
const PHOTO_LIBRARY = {
  monthly: [
    {
      title: "睡前共读", meta: "5 月 18 日 · 3 张照片", source: "亲子任务", sourceTone: "info",
      photos: [
        { label: "共读 1", tone: "green" },
        { label: "共读 2", tone: "green" },
        { label: "共读 3", tone: "green" }
      ]
    },
    {
      title: "小区植物观察", meta: "5 月 26 日 · 2 张照片", source: "社区任务", sourceTone: "warn",
      photos: [
        { label: "植物 1", tone: "blue" },
        { label: "植物 2", tone: "blue" }
      ]
    },
    {
      title: "自己整理餐具", meta: "6 月 03 日 · 1 张照片", source: "亲子任务", sourceTone: "info",
      photos: [{ label: "餐具", tone: "warn" }]
    }
  ],
  term: [
    {
      title: "5 月亲子阅读", meta: "5 月 · 2 张照片", source: "亲子任务", sourceTone: "info",
      photos: [
        { label: "阅读 1", tone: "green" },
        { label: "阅读 2", tone: "green" }
      ]
    },
    {
      title: "4 月生活习惯", meta: "4 月 · 3 张照片", source: "亲子任务", sourceTone: "info",
      photos: [
        { label: "习惯 1", tone: "blue" },
        { label: "习惯 2", tone: "blue" },
        { label: "习惯 3", tone: "blue" }
      ]
    },
    {
      title: "3 月社区活动", meta: "3 月 · 2 张照片", source: "社区任务", sourceTone: "warn",
      photos: [
        { label: "社区 1", tone: "warn" },
        { label: "社区 2", tone: "warn" }
      ]
    }
  ]
};

/* 成长册：按 ?book= 差异化，直接展示完整内容（章节对应教师端成长册构成项） */
const GROWTH_BOOKS = {
  "small-1": {
    title: "小班上学期成长册",
    term: "2024 秋季学期",
    status: "已生成",
    statusClass: "done",
    intro: "小雨第一个学期的园所生活记录：从入园适应到愿意参加集体游戏，慢慢熟悉了班级的一日流程。",
    sections: [
      {
        name: "园所介绍",
        copy: "化龙幼儿园以“衣食住行艺”生活课程为特色，小班以入园适应和生活习惯养成为主要目标。",
        photos: [{ label: "园所", tone: "green" }, { label: "班级", tone: "blue" }]
      },
      {
        name: "在园时光",
        copy: "本学期参与了 16 次班级活动。小雨从旁观到主动加入，最喜欢自然角照料和音乐律动。",
        photos: [{ label: "律动", tone: "green" }, { label: "自然角", tone: "blue" }, { label: "游戏", tone: "warn" }]
      },
      {
        name: "亲子活动",
        copy: "家庭完成 6 次亲子任务，其中“我的小书包”和“周末公园观察”提交了完整图文记录。",
        photos: [{ label: "书包", tone: "warn" }, { label: "公园", tone: "green" }]
      },
      {
        name: "家长动态",
        copy: "家长月度评语摘录：“入园两个月后，早上能自己背书包走进教室，跟家人挥手再见。”",
        photos: []
      },
      {
        name: "发展评估",
        copy: "五大领域发展均衡，健康与艺术领域表现突出，语言表达在学期后半段进步明显。",
        photos: [{ label: "评估", tone: "blue" }]
      },
      {
        name: "幼儿评语",
        copy: "陈老师：小雨是个温和又好奇的孩子，愿意观察、愿意尝试，期待下学期更多的主动表达。",
        photos: []
      },
      {
        name: "体检数据",
        copy: "身高 102cm，体重 16.2kg，视力正常，生长曲线在同龄标准范围内。",
        photos: []
      }
    ]
  },
  "small-2": {
    title: "小班下学期成长册",
    term: "2025 春季学期",
    status: "已生成",
    statusClass: "done",
    intro: "这个学期小雨的生活自理和同伴交往都有明显进步，开始喜欢把自己的发现讲给大家听。",
    sections: [
      {
        name: "园所介绍",
        copy: "本学期班级围绕“食”与“行”开展生活课程，孩子们参与了种植、买菜模拟和社区散步活动。",
        photos: [{ label: "种植", tone: "green" }, { label: "散步", tone: "blue" }]
      },
      {
        name: "在园时光",
        copy: "参与班级活动 18 次。小雨在种植角坚持记录豆苗生长，并在分享会上介绍了自己的观察。",
        photos: [{ label: "豆苗", tone: "green" }, { label: "分享", tone: "warn" }, { label: "记录", tone: "blue" }]
      },
      {
        name: "亲子活动",
        copy: "家庭完成 7 次亲子任务，“睡前共读”坚持了整个学期，沉淀了丰富的图文素材。",
        photos: [{ label: "共读", tone: "green" }, { label: "记录", tone: "blue" }]
      },
      {
        name: "家长动态",
        copy: "家长月度评语摘录：“会主动帮忙摆碗筷，吃完饭把自己的餐具放回水池。”",
        photos: []
      },
      {
        name: "发展评估",
        copy: "语言与社会领域进步显著，能用完整句子描述事件，愿意等待和轮流。",
        photos: [{ label: "评估", tone: "blue" }]
      },
      {
        name: "幼儿评语",
        copy: "黄老师：小雨越来越愿意表达，遇到困难会先自己试一试。希望暑假继续保持阅读习惯。",
        photos: []
      },
      {
        name: "体检数据",
        copy: "身高 106cm，体重 17.1kg，视力正常，龋齿检查无异常。",
        photos: []
      }
    ]
  },
  "middle-1": {
    title: "中班上学期成长册",
    term: "2025 秋季学期",
    status: "生成中",
    statusClass: "warn",
    intro: "本学期内容教师整理中：亲子任务反馈与幼儿评语补齐后，将呈现完整成长册。以下为已归档内容。",
    sections: [
      {
        name: "园所介绍",
        copy: "中班围绕“住”与“行”开展社区主题课程，孩子们走进留耕堂等社区场所进行实地观察。",
        photos: [{ label: "社区", tone: "green" }, { label: "课程", tone: "blue" }]
      },
      {
        name: "在园时光",
        copy: "已参与班级活动 12 次。小雨在社区观察和积木搭建活动中表现出较强的观察力与合作意识。",
        photos: [{ label: "观察", tone: "green" }, { label: "积木", tone: "warn" }, { label: "合作", tone: "blue" }]
      },
      {
        name: "亲子活动",
        copy: "已完成 5 次亲子任务，还有 1 条家庭反馈待提交（社区任务：留耕堂门前的石阶）。",
        photos: [{ label: "共读", tone: "green" }, { label: "植物", tone: "blue" }]
      },
      {
        name: "家长动态",
        copy: "家长月度评语摘录：“会把故事里的角色和白天在幼儿园发生的事情联系起来。”",
        photos: []
      },
      {
        name: "发展评估",
        copy: "2025 年度综合评价已推送：表达主动性、生活自理和活动参与形成稳定的发展轨迹。",
        photos: [{ label: "雷达", tone: "blue" }]
      },
      {
        name: "幼儿评语",
        copy: "教师撰写中，学期结束前更新。",
        photos: []
      },
      {
        name: "体检数据",
        copy: "身高 110cm，体重 18.0kg，视力正常，保健室已同步秋季体检结果。",
        photos: []
      }
    ]
  }
};

/* ========== 动态渲染 ========== */

/* 月度/学期共享的“过往相片”抽屉内容渲染（去除两页复制的 DOM） */
function renderPhotoPickers() {
  document.querySelectorAll("[data-photo-picker]").forEach((picker) => {
    const id = picker.dataset.photoPicker;
    const records = PHOTO_LIBRARY[id];
    if (!records || picker.children.length) return;
    picker.innerHTML = records.map((record) => `
      <article class="record-card">
        <div class="record-head">
          <div><h3>${record.title}</h3><p>${record.meta}</p></div>
          <span class="status ${record.sourceTone}">${record.source}</span>
        </div>
        <div class="photo-grid">
          ${record.photos.map((photo, index) => `
            <label class="record-photo">
              <input type="checkbox" name="${id}-history-photo" aria-label="${record.title}照片 ${index + 1}">
              <span class="photo-thumb ${photo.tone}">${photo.label}</span>
            </label>`).join("")}
        </div>
      </article>`).join("");
  });
}

/* 成长册：解析 ?book=，直接渲染完整内容章节 */
function bindGrowthBook() {
  const root = document.querySelector("[data-growth-book]");
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("book") || "middle-1";
  const data = GROWTH_BOOKS[id] || GROWTH_BOOKS["middle-1"];

  const titles = root.querySelectorAll("[data-book-title]");
  const term = root.querySelector("[data-book-term]");
  const status = root.querySelector("[data-book-status]");
  const intro = root.querySelector("[data-book-intro]");
  const sections = root.querySelector("[data-book-sections]");

  titles.forEach((el) => { el.textContent = data.title; });
  if (term) term.textContent = `${data.term} · 小雨`;
  if (status) {
    status.textContent = data.status;
    status.className = `status ${data.statusClass}`;
  }
  if (intro) intro.textContent = data.intro;
  if (sections) {
    sections.innerHTML = data.sections.map((section) => `
      <article class="card eval-detail-card">
        <div class="eval-history-head">
          <div><h2>${section.name}</h2></div>
          <span class="icon">${section.name.slice(0, 1)}</span>
        </div>
        <div class="eval-copy"><p>${section.copy}</p></div>
        ${section.photos.length ? `
        <div class="eval-photo-grid" style="--photo-cols:${Math.min(3, section.photos.length)};">
          ${section.photos.map((photo) => `<div class="eval-photo ${photo.tone}">${photo.label}</div>`).join("")}
        </div>` : ""}
      </article>`).join("");
  }
}

/* 五大领域雷达图（SVG）：孩子 vs 班级平均，色板取自项目图表规范 */
function radarSVG(domains) {
  const cx = 130;
  const cy = 116;
  const R = 84;
  const MAX = 5;
  const N = domains.length;
  const point = (index, radius) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / N;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  };
  const polygon = (values) => values
    .map((value, index) => point(index, (value / MAX) * R).map((n) => n.toFixed(1)).join(","))
    .join(" ");

  const rings = [1, 2, 3, 4, 5].map((step) => `
    <polygon points="${domains.map((_, i) => point(i, (step / MAX) * R).map((n) => n.toFixed(1)).join(",")).join(" ")}"
      fill="none" stroke="var(--border)" stroke-width="${step === 5 ? 1.4 : 1}" />`).join("");

  const axes = domains.map((_, i) => {
    const [x, y] = point(i, R);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--border)" stroke-width="1" />`;
  }).join("");

  const labels = domains.map((domain, i) => {
    const [x, y] = point(i, R + 18);
    return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle"
      font-size="12" font-weight="700" fill="var(--fg)">${domain.name}</text>`;
  }).join("");

  return `
  <svg viewBox="0 0 260 232" role="img" aria-label="五大领域发展雷达图">
    ${rings}${axes}
    <polygon points="${polygon(domains.map((d) => d.cls))}" fill="none"
      stroke="#3388fc" stroke-width="2" stroke-dasharray="5 4" stroke-linejoin="round" />
    <polygon points="${polygon(domains.map((d) => d.child))}" fill="rgba(24,155,145,.18)"
      stroke="#189b91" stroke-width="2.2" stroke-linejoin="round" />
    ${domains.map((d, i) => {
      const [x, y] = point(i, (d.child / MAX) * R);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#189b91" />`;
    }).join("")}
    ${labels}
  </svg>`;
}

function renderRadarBlock(root, domains) {
  const block = root.querySelector("[data-history-radar]");
  if (!block) return;
  if (!domains) {
    block.hidden = true;
    return;
  }
  block.hidden = false;
  block.innerHTML = `
    <h3>五大领域发展雷达（5 分制）</h3>
    <div class="radar-wrap">${radarSVG(domains)}</div>
    <div class="radar-legend">
      <span class="legend-item"><i class="legend-swatch child"></i>小雨</span>
      <span class="legend-item"><i class="legend-swatch cls"></i>班级平均</span>
    </div>
    <table class="table">
      <thead><tr><th>领域</th><th>小雨</th><th>班级平均</th></tr></thead>
      <tbody>
        ${domains.map((d) => `<tr><th>${d.name}</th><td>${d.child.toFixed(1)}</td><td>${d.cls.toFixed(1)}</td></tr>`).join("")}
      </tbody>
    </table>`;
}

function bindParentTaskDetail() {
  const root = document.querySelector("[data-parent-task-detail]");
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("id") || "community-liugengtang";
  const data = PARENT_TASKS[id] || PARENT_TASKS["community-liugengtang"];
  const pageTitle = document.querySelector("[data-parent-task-page-title]");
  const status = document.querySelector("[data-parent-task-status]");
  const name = root.querySelector("[data-parent-task-name]");
  const background = root.querySelector("[data-parent-task-background]");
  const detail = root.querySelector("[data-parent-task-detail-copy]");
  const share = root.querySelector("[data-parent-task-share]");
  const photos = root.querySelector("[data-parent-task-photos]");

  if (pageTitle) pageTitle.textContent = data.pageTitle;
  if (status) {
    status.textContent = data.status;
    status.className = `status ${data.statusClass}`;
  }
  if (name) name.textContent = data.name;
  if (background) background.textContent = data.background || "";
  if (detail) detail.textContent = data.detail || "";

  const isHistory = data.mode === "history";
  root.querySelectorAll("[data-task-brief-block]").forEach((block) => {
    block.hidden = isHistory;
  });
  root.querySelectorAll("[data-task-submit-block]").forEach((block) => {
    block.hidden = isHistory;
  });

  const historyBlock = root.querySelector("[data-task-history-block]");
  if (historyBlock) historyBlock.hidden = !isHistory;
  if (share) share.textContent = data.share || "";
  if (photos) {
    const taskPhotos = data.photos || [];
    photos.style.setProperty("--photo-cols", Math.min(3, taskPhotos.length || 1));
    photos.innerHTML = taskPhotos.map((photo) => `<div class="eval-photo ${photo.tone}">${photo.label}</div>`).join("");
  }
}

function bindHistoryDetail() {
  const root = document.querySelector("[data-history-detail]");
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get("id") || "monthly-05";
  const data = HISTORY_EVALUATIONS[id] || HISTORY_EVALUATIONS["monthly-05"];
  const title = root.querySelector("[data-history-title]");
  const heading = root.querySelector("[data-history-heading]");
  const meta = root.querySelector("[data-history-meta]");
  const type = root.querySelector("[data-history-type]");
  const copy = root.querySelector("[data-history-copy]");
  const photos = root.querySelector("[data-history-photos]");

  if (title) title.textContent = data.title;
  if (heading) heading.textContent = data.heading;
  if (meta) meta.textContent = data.meta;
  if (type) {
    type.textContent = data.type;
    type.className = `status ${data.typeClass}`;
  }
  if (copy) {
    copy.innerHTML = data.copy.map((paragraph) => `<p>${paragraph}</p>`).join("");
  }
  renderRadarBlock(root, data.domains);
  if (photos) {
    photos.style.setProperty("--photo-cols", Math.min(3, data.photos.length));
    photos.innerHTML = data.photos.map((photo) => `<div class="eval-photo ${photo.tone}">${photo.label}</div>`).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindTabs();
  bindSelectableButtons();
  bindTokenFilters();
  bindMatrixFilters();
  bindDynamicBack();
  renderPhotoPickers();
  bindGrowthBook();
  bindHistoryDetail();
  bindParentTaskDetail();
  bindPhotoSheets();
  bindPhotoChoices();
  bindFileUploads();
  bindForms();
  bindChildSwitch();
});
