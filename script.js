// ① URLパラメータから storeID を取得
const params = new URLSearchParams(window.location.search);
const storeId = params.get("store") || "default";
console.log("店舗ID:", storeId);

// ② 店舗ごとの waiting を読み込む
let waiting = JSON.parse(localStorage.getItem(`waiting_${storeId}`)) || [];

// ③ 店舗ごとに waiting を保存
function save() {
    localStorage.setItem(`waiting_${storeId}`, JSON.stringify(waiting));
}

function render() {
    const reception = document.getElementById("reception");
    const waitingList = document.getElementById("waitingList");

    reception.innerHTML = "";
    waitingList.innerHTML = "";

    document.getElementById("waitingCount").textContent = waiting.length;

    // 使用中番号
    for (let i = 1; i <= 8; i++) {
        if (!waiting.includes(i)) {
            reception.innerHTML +=
                '<button class="number-button" onclick="addWaiting(' + i + ')">' +
                i +
                '</button>';
        }
    }

    // 待機中一覧
    if (waiting.length === 0) {
        waitingList.innerHTML =
            '<div class="empty">待機中のお客様はいません</div>';
    } else {
        waiting.forEach(function(number) {
            waitingList.innerHTML +=
                '<div class="card">' +
                '<div class="number">' + number + '番</div>' +
                '<button class="return-button" onclick="returnNumber(' + number + ')">番号札回収</button>' +
                '</div>';
        });
    }
}

function addWaiting(number) {
    if (confirm(number + "番で受付しますか？")) {
        waiting.push(number);
        save();
        render();
    }
}

function returnNumber(number) {
    if (confirm(number + "番の番号札を回収しますか？")) {
        waiting = waiting.filter(function(n) {
            return n !== number;
        });
        save();
        render();
    }
}

document.getElementById("resetButton").addEventListener("click", function() {
    if (confirm("全てのデータを削除しますか？")) {
        waiting = [];
        save();
        render();
    }
});

render();

