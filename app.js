const form = document.querySelector(".signup");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const email = input.value.trim();

    if (!email) {
      input.focus();
      return;
    }

    form.innerHTML = '<p class="thanks">已收到订阅请求。接入邮件服务后，这里会写入真实订阅列表。</p>';
  });
}
