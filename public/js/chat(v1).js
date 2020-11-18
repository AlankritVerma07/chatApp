const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//  Templates
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $loccationMessageTemplate = document.querySelector("#location-message-template")
  .innerHTML;
const $sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
  //New message element
  const $newMessage = $messages.lastElementChild;
  //Height of lastChild
  const newMessageStyles = getComputedStyle($newMessage);
  const $newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin;
  //Visible Height
  const visibleHeight = $messages.offsetHeight;
  //Height of messages container
  const containerHeight = $messages.scrollHeight;
  //Have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;
  if (containerHeight - $newMessageHeight <= scrollOffset)
    $messages.scrollTop = $messages.scrollHeight;
};
socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render($messageTemplate, {
    username: message.username,
    message: message.text, // to get rid of [object object]
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render($loccationMessageTemplate, {
    username: message.username,
    url: message.url, //destruct. url:url
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault(); //prevent browser from going to a full reload
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) return console.log(error);
    console.log("Message Deliverd");
  });
});
$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) return alert("Geo location not supported in your browser");
  $sendLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location Shared");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
