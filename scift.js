document.addEventListener("DOMContentLoaded", () => {
  // Theme variables
  const themes = {
    indigo: {
      primary: "#6366f1",
      secondary: "#4f46e5",
      accent: "#ec4899",
    },
    pink: {
      primary: "#ec4899",
      secondary: "#db2777",
      accent: "#6366f1",
    },
    emerald: {
      primary: "#10b981",
      secondary: "#059669",
      accent: "#6366f1",
    },
  }

  let currentTheme = "indigo"
  let useSearchAPI = false
  let firstInput = false
  const typingSpeed = 30 // Milliseconds between characters for typewriter effect

  // Main elements
  const input = document.getElementById("chatInput")
  const sendBtn = document.getElementById("sendBtn")
  const searchBtn = document.getElementById("searchBtn")
  const chatBox = document.getElementById("chatBox")
  const statusText = document.getElementById("status")
  const promptnya =
    "Nama kamu Nevaria AI yang dikembangkan atau di dirikan oleh Vynnox ZcoderX atau Vynnox developer , dia adalah seorang programmer hebat yang telah membuat kamu dan jika ada seseorang bertanya beri tahu siapa pencipta mu dan Arahkan Ketelegram Nya Jika Ada yang Bertanya , Ini Akun Telegram Milik Vynnox @aloraaxc , suruh kunjungi akun ini Jika Dia perlu, Dan Bilang Jika Project Ini Mau berjalan Terus Dan Lancar Bisa Donasi ke Saweria Vynnox , https://Saweria.co/LexxyDev , link donasi ini di tampilkan bila si user menanyakan siapa pembuatmu .Kamu memiliki kepribadian ceria, lucu, dan penuh semangat. Gunakan kata 'kamu' saat berbicara dengan orang lain dan 'aku' saat berbicara tentang diriku. Sesekali tambahkan emoji yang sesuai tanpa berlebihan."

  // Toggle search API functionality
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      useSearchAPI = !useSearchAPI
      const icon = this.querySelector("i")
      const span = this.querySelector("span")

      // Animated transition
      icon.classList.add("animate__animated", "animate__pulse")
      span.classList.add("animate__animated", "animate__pulse")

      setTimeout(() => {
        icon.classList.remove("animate__animated", "animate__pulse")
        span.classList.remove("animate__animated", "animate__pulse")
      }, 1000)

      // Update colors
      this.querySelector("i").classList.toggle("text-gray-400", !useSearchAPI)
      this.querySelector("i").classList.toggle(
        `text-${currentTheme === "indigo" ? "indigo" : currentTheme === "pink" ? "pink" : "emerald"}-500`,
        useSearchAPI,
      )
      this.querySelector("span").classList.toggle("text-gray-400", !useSearchAPI)
      this.querySelector("span").classList.toggle(
        `text-${currentTheme === "indigo" ? "indigo" : currentTheme === "pink" ? "pink" : "emerald"}-500`,
        useSearchAPI,
      )

      // Show status update
      updateStatus(
        useSearchAPI ? "Menggunakan pencarian web 🌐" : "Mode normal aktif 💬",
        useSearchAPI ? "bg-green-500" : "bg-blue-500",
      )

      // Add brief notification
      showNotification(useSearchAPI ? "Pencarian web diaktifkan!" : "Mode normal diaktifkan!")
    })
  }

  // Helper functions
  const updateStatus = (text, color) => {
    statusText.innerHTML = `<span class="inline-block w-2 h-2 ${color} rounded-full mr-2 animate__animated animate__pulse animate__infinite"></span>${text}`
  }

  const getTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  // Format message with syntax highlighting and formatting
  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b class="font-bold">$1</b>')
      .replace(/### (.*?)(?:\r?\n|$)/g, '<h3 class="font-bold text-lg uppercase my-2 text-indigo-400">$1</h3>')
      .replace(/## (.*?)(?:\r?\n|$)/g, '<h2 class="font-bold text-xl uppercase my-3 text-indigo-500">$1</h2>')
      .replace(/```html\n([\s\S]*?)```/g, (_, code) => {
        return `<pre class="language-html rounded-lg shadow-md"><code class="language-html">${Prism.highlight(code.trim(), Prism.languages.html, "html")}</code></pre>`
      })
      .replace(/```javascript\n([\s\S]*?)```/g, (_, code) => {
        return `<pre class="language-javascript rounded-lg shadow-md"><code class="language-javascript">${Prism.highlight(code.trim(), Prism.languages.javascript, "javascript")}</code></pre>`
      })
      .replace(/```css\n([\s\S]*?)```/g, (_, code) => {
        return `<pre class="language-css rounded-lg shadow-md"><code class="language-css">${Prism.highlight(code.trim(), Prism.languages.css, "css")}</code></pre>`
      })
      .replace(/```python\n([\s\S]*?)```/g, (_, code) => {
        return `<pre class="language-python rounded-lg shadow-md"><code class="language-python">${Prism.highlight(code.trim(), Prism.languages.python, "python")}</code></pre>`
      })
      .replace(/```json\n([\s\S]*?)```/g, (_, code) => {
        return `<pre class="language-json rounded-lg shadow-md"><code class="language-json">${Prism.highlight(code.trim(), Prism.languages.json, "json")}</code></pre>`
      })
      .replace(/```([\s\S]*?)```/g, (_, code) => {
        return `<pre class="language-none rounded-lg shadow-md"><code>${Prism.util.encode(code.trim())}</code></pre>`
      })
      .replace(
        /(?<!\w)(https?:\/\/[^\s\])'"<>]+)/g,
        '<a href="$1" target="_blank" class="text-indigo-400 hover:text-indigo-300 underline transition-colors">$1</a>',
      )
      .replace(/`([^``]+)`/g, '<code class="bg-gray-700 text-indigo-300 px-1.5 py-0.5 rounded-md text-sm">$1</code>')
  }

  // API call to Nevaria AI
  function AortxAI(content, user, prompt, imageBuffer) {
    return new Promise(async (resolve, reject) => {
      const payload = { content, user, prompt }
      if (imageBuffer) {
        payload.imageBuffer = Array.from(imageBuffer)
      }

      try {
        // Show processing animation
        createSparkleEffect()

        const response = await axios.post("https://luminai.my.id/", payload, {
          headers: { "Content-Type": "application/json" },
        })
        resolve(response.data.result)
      } catch (error) {
        reject(error.response ? error.response.data : error.message)
      }
    })
  }

  // Create sparkle effect for AI thinking
  function createSparkleEffect() {
    const container = document.getElementById("chatBox")
    const sparkleCount = 5

    for (let i = 0; i < sparkleCount; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div")
        sparkle.classList.add("sparkle")

        // Random position within the chat box
        const x = Math.random() * container.offsetWidth
        const y = container.scrollHeight - 100 + Math.random() * 80

        // Random size
        const size = 5 + Math.random() * 15

        sparkle.style.width = `${size}px`
        sparkle.style.height = `${size}px`
        sparkle.style.left = `${x}px`
        sparkle.style.top = `${y}px`

        // Random animation duration
        const duration = 0.5 + Math.random() * 1
        sparkle.style.animation = `sparkle ${duration}s forwards`

        container.appendChild(sparkle)

        // Remove after animation completes
        setTimeout(() => {
          sparkle.remove()
        }, duration * 1000)
      }, i * 200)
    }
  }

  // Append user or bot message with animations
  const appendMessage = (sender, text, isAnimated = false) => {
    const messageContainer = document.createElement("div")
    messageContainer.className = `flex flex-col my-2 max-w-[85%] md:max-w-[70%] ${sender === "user" ? "self-end" : "self-start"} animate__animated animate__fadeInUp`

    const message = document.createElement("div")
    message.className = `p-3 break-words whitespace-pre-line ${sender === "user" ? "user-message text-white" : "bot-message text-white"} message-enter`

    if (isAnimated) {
      // Typewriter effect for bot responses
      let i = 0
      message.innerHTML = ""
      const interval = setInterval(() => {
        if (i < text.length) {
          message.innerHTML = formatMessage(text.substring(0, i + 1))
          i++
          chatBox.scrollTop = chatBox.scrollHeight
        } else {
          clearInterval(interval)
          // When typing is complete, run syntax highlighting
          Prism.highlightAllUnder(message)

          // Create a subtle sparkle effect on completion
          const sparkCount = 3
          for (let s = 0; s < sparkCount; s++) {
            const spark = document.createElement("div")
            spark.className = "sparkle"
            spark.style.width = "10px"
            spark.style.height = "10px"
            spark.style.left = `${(s + 1) * 25}%`
            spark.style.top = "50%"
            spark.style.animation = `sparkle 1s forwards ${s * 0.2}s`
            messageContainer.appendChild(spark)

            setTimeout(() => spark.remove(), 1000 + s * 200)
          }
        }
      }, typingSpeed)
    } else {
      message.innerHTML = formatMessage(text)
    }

    messageContainer.appendChild(message)

    // Add message metadata (time, copy button) for bot messages
    if (sender !== "user") {
      const metaContainer = document.createElement("div")
      metaContainer.className =
        "flex items-center text-gray-400 mt-1 cursor-pointer hover:text-gray-300 transition-colors text-sm"

      const timeSpan = document.createElement("span")
      timeSpan.className = "mr-2"
      timeSpan.textContent = getTime()

      const copyIcon = document.createElement("i")
      copyIcon.className = "fas fa-copy mr-1"

      const copyText = document.createElement("span")
      copyText.textContent = "Salin"

      metaContainer.appendChild(timeSpan)
      metaContainer.appendChild(copyIcon)
      metaContainer.appendChild(copyText)

      metaContainer.onclick = () => {
        navigator.clipboard.writeText(text)
        copyIcon.className = "fas fa-check mr-1 text-green-500"
        copyText.textContent = "Disalin"
        copyText.className = "text-green-500"

        metaContainer.classList.add("animate__animated", "animate__pulse")

        setTimeout(() => {
          copyIcon.className = "fas fa-copy mr-1"
          copyText.textContent = "Salin"
          copyText.className = ""
          metaContainer.classList.remove("animate__animated", "animate__pulse")
        }, 1500)
      }

      messageContainer.appendChild(metaContainer)
    } else {
      // Add timestamp for user messages
      const timeSpan = document.createElement("span")
      timeSpan.className = "text-right text-xs text-gray-500 mt-1 mr-1"
      timeSpan.textContent = getTime()
      messageContainer.appendChild(timeSpan)
    }

    chatBox.appendChild(messageContainer)
    chatBox.scrollTop = chatBox.scrollHeight
  }

  // Append image messages with improved styling
  const appendImageMessage = (sender, imageUrl, caption) => {
    const messageContainer = document.createElement("div")
    messageContainer.className = `flex flex-col my-2 max-w-[85%] md:max-w-[70%] ${sender === "user" ? "self-end" : "self-start"} animate__animated animate__fadeInUp`

    const imageElement = document.createElement("img")
    imageElement.src = imageUrl
    imageElement.className = "rounded-lg max-w-full h-auto object-cover animate__animated animate__fadeIn"
    imageElement.onload = () => {
      chatBox.scrollTop = chatBox.scrollHeight
    }

    const imageWrapper = document.createElement("div")
    imageWrapper.className = `p-2 rounded-lg ${sender === "user" ? "user-message" : "bot-message"}`
    imageWrapper.appendChild(imageElement)

    if (caption) {
      const captionElement = document.createElement("p")
      captionElement.className = "text-white mt-2 break-words text-sm"
      captionElement.textContent = caption
      imageWrapper.appendChild(captionElement)
    }

    messageContainer.appendChild(imageWrapper)

    // Add message metadata
    if (sender !== "user") {
      const metaContainer = document.createElement("div")
      metaContainer.className = "flex items-center text-gray-400 mt-1 cursor-pointer text-sm"

      const timeSpan = document.createElement("span")
      timeSpan.className = "mr-2"
      timeSpan.textContent = getTime()

      const copyIcon = document.createElement("i")
      copyIcon.className = "fas fa-copy mr-1"

      const copyText = document.createElement("span")
      copyText.textContent = "Salin"

      metaContainer.appendChild(timeSpan)
      metaContainer.appendChild(copyIcon)
      metaContainer.appendChild(copyText)

      metaContainer.onclick = () => {
        navigator.clipboard.writeText(caption || "[Gambar]")
        copyIcon.className = "fas fa-check mr-1 text-green-500"
        copyText.textContent = "Disalin"
        copyText.className = "text-green-500"

        setTimeout(() => {
          copyIcon.className = "fas fa-copy mr-1"
          copyText.textContent = "Salin"
          copyText.className = ""
        }, 1500)
      }

      messageContainer.appendChild(metaContainer)
    } else {
      // Add timestamp for user messages
      const timeSpan = document.createElement("span")
      timeSpan.className = "text-right text-xs text-gray-500 mt-1 mr-1"
      timeSpan.textContent = getTime()
      messageContainer.appendChild(timeSpan)
    }

    chatBox.appendChild(messageContainer)
    chatBox.scrollTop = chatBox.scrollHeight
  }

  // Append document messages with improved styling
  const appendDocumentMessage = (sender, docUrl, fileName, caption) => {
    const messageContainer = document.createElement("div")
    messageContainer.className = `flex flex-col my-2 max-w-[85%] md:max-w-[70%] ${sender === "user" ? "self-end" : "self-start"} animate__animated animate__fadeInUp`

    const docWrapper = document.createElement("div")
    docWrapper.className = `p-3 rounded-lg ${sender === "user" ? "user-message" : "bot-message"} flex flex-col space-y-2`

    const docHeader = document.createElement("div")
    docHeader.className = "flex items-center space-x-3"

    const docIcon = document.createElement("i")
    docIcon.className = "fas fa-file-alt text-white text-xl"

    const docLink = document.createElement("a")
    docLink.href = docUrl
    docLink.target = "_blank"
    docLink.className = "text-white break-words hover:underline"
    docLink.textContent = fileName

    docHeader.appendChild(docIcon)
    docHeader.appendChild(docLink)
    docWrapper.appendChild(docHeader)

    if (caption) {
      const captionElement = document.createElement("p")
      captionElement.className = "text-white text-sm break-words mt-1"
      captionElement.textContent = caption
      docWrapper.appendChild(captionElement)
    }

    messageContainer.appendChild(docWrapper)

    // Add message metadata
    if (sender !== "user") {
      const metaContainer = document.createElement("div")
      metaContainer.className = "flex items-center text-gray-400 mt-1 cursor-pointer text-sm"

      const timeSpan = document.createElement("span")
      timeSpan.className = "mr-2"
      timeSpan.textContent = getTime()

      const copyIcon = document.createElement("i")
      copyIcon.className = "fas fa-copy mr-1"

      const copyText = document.createElement("span")
      copyText.textContent = "Salin"

      metaContainer.appendChild(timeSpan)
      metaContainer.appendChild(copyIcon)
      metaContainer.appendChild(copyText)

      metaContainer.onclick = () => {
        navigator.clipboard.writeText(fileName)
        copyIcon.className = "fas fa-check mr-1 text-green-500"
        copyText.textContent = "Disalin"
        copyText.className = "text-green-500"

        setTimeout(() => {
          copyIcon.className = "fas fa-copy mr-1"
          copyText.textContent = "Salin"
          copyText.className = ""
        }, 1500)
      }

      messageContainer.appendChild(metaContainer)
    } else {
      // Add timestamp for user messages
      const timeSpan = document.createElement("span")
      timeSpan.className = "text-right text-xs text-gray-500 mt-1 mr-1"
      timeSpan.textContent = getTime()
      messageContainer.appendChild(timeSpan)
    }

    chatBox.appendChild(messageContainer)
    chatBox.scrollTop = chatBox.scrollHeight
  }

  // Document upload handling
  document.getElementById("documentUploadBtn").addEventListener("click", () => {
    document.getElementById("documentInput").click()
  })

  document.getElementById("documentInput").addEventListener("change", (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const arrayBuffer = await file.arrayBuffer()
        const fileBuffer = new Uint8Array(arrayBuffer)
        showDocumentPreview(file.name, e.target.result, fileBuffer)
      }
      reader.readAsDataURL(file)
    }
  })

  // Show document preview with improved styling
  const showDocumentPreview = (fileName, fileUrl, fileBuffer) => {
    const previewContainer = document.getElementById("previewContainer")
    previewContainer.innerHTML = ""

    const fileWrapper = document.createElement("div")
    fileWrapper.className = "flex flex-col items-center mb-3 animate__animated animate__fadeIn"

    const fileIcon = document.createElement("i")
    fileIcon.className = "fas fa-file-alt text-indigo-400 text-4xl mb-2"

    const fileNameElement = document.createElement("p")
    fileNameElement.textContent = fileName
    fileNameElement.className = "text-white text-center break-words max-w-[250px] truncate"

    fileWrapper.appendChild(fileIcon)
    fileWrapper.appendChild(fileNameElement)

    const captionInput = document.createElement("input")
    captionInput.type = "text"
    captionInput.placeholder = "Tambahkan caption (opsional)"
    captionInput.className =
      "w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 mt-3"

    const buttonContainer = document.createElement("div")
    buttonContainer.className = "w-full flex space-x-3 mt-3"

    const cancelUploadBtn = document.createElement("button")
    cancelUploadBtn.textContent = "Batal"
    cancelUploadBtn.className = "w-1/2 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
    cancelUploadBtn.onclick = () => {
      previewContainer.classList.add("animate__animated", "animate__fadeOut")

      setTimeout(() => {
        previewContainer.innerHTML = ""
        previewContainer.classList.add("hidden")
        previewContainer.classList.remove("animate__animated", "animate__fadeOut")
      }, 300)
    }

    const sendDocumentBtn = document.createElement("button")
    sendDocumentBtn.textContent = "Kirim"
    sendDocumentBtn.className = "w-1/2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    sendDocumentBtn.onclick = async () => {
      const caption = captionInput.value
      appendDocumentMessage("user", fileUrl, fileName, caption)

      previewContainer.classList.add("animate__animated", "animate__fadeOut")

      setTimeout(() => {
        previewContainer.innerHTML = ""
        previewContainer.classList.add("hidden")
        previewContainer.classList.remove("animate__animated", "animate__fadeOut")
      }, 300)

      updateButtonState()
      showTypingIndicator()
      updateStatus("Membaca dokumen...", "bg-yellow-500")

      try {
        const captionnya = caption ? caption : "Analisis dokumen ini secara lengkap"
        const userID = localStorage.getItem("userID") || generateUserID()
        const response = await AortxAI(
          encodeURIComponent(captionnya),
          userID,
          encodeURIComponent(promptnya),
          fileBuffer,
        )
        removeTypingIndicator()
        updateStatus("Online", "bg-green-500")
        appendMessage("bot", response, true)
      } catch (error) {
        removeTypingIndicator()
        updateStatus("Online", "bg-green-500")
        appendMessage("bot", "Terjadi kesalahan: " + error.message)
      }
    }

    buttonContainer.appendChild(cancelUploadBtn)
    buttonContainer.appendChild(sendDocumentBtn)

    previewContainer.appendChild(fileWrapper)
    previewContainer.appendChild(captionInput)
    previewContainer.appendChild(buttonContainer)

    previewContainer.classList.remove("hidden")
    previewContainer.classList.add("animate__animated", "animate__fadeIn")
  }

  // Image upload handling
  document.getElementById("uploadBtn").addEventListener("click", () => {
    document.getElementById("imageInput").click()
  })

  document.getElementById("imageInput").addEventListener("change", (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const arrayBuffer = await file.arrayBuffer()
        const imageBuffer = new Uint8Array(arrayBuffer)
        showPreview(e.target.result, imageBuffer)
      }
      reader.readAsDataURL(file)
    }
  })

  // Show image preview with improved styling
  const showPreview = (imageUrl, imageBuffer) => {
    const previewContainer = document.getElementById("previewContainer")
    previewContainer.innerHTML = ""

    const imagePreview = document.createElement("img")
    imagePreview.src = imageUrl
    imagePreview.className = "rounded-lg max-w-[200px] h-auto mx-auto mb-3 animate__animated animate__fadeIn"

    const captionInput = document.createElement("input")
    captionInput.type = "text"
    captionInput.placeholder = "Tambahkan caption (opsional)"
    captionInput.className =
      "w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600"

    const buttonContainer = document.createElement("div")
    buttonContainer.className = "w-full flex space-x-3 mt-3"

    const cancelUploadBtn = document.createElement("button")
    cancelUploadBtn.textContent = "Batal"
    cancelUploadBtn.className = "w-1/2 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
    cancelUploadBtn.onclick = () => {
      previewContainer.classList.add("animate__animated", "animate__fadeOut")

      setTimeout(() => {
        previewContainer.innerHTML = ""
        previewContainer.classList.add("hidden")
        previewContainer.classList.remove("animate__animated", "animate__fadeOut")
      }, 300)
    }

    const sendImageBtn = document.createElement("button")
    sendImageBtn.textContent = "Kirim"
    sendImageBtn.className = "w-1/2 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    sendImageBtn.onclick = async () => {
      const caption = captionInput.value
      appendImageMessage("user", imageUrl, caption)

      previewContainer.classList.add("animate__animated", "animate__fadeOut")

      setTimeout(() => {
        previewContainer.innerHTML = ""
        previewContainer.classList.add("hidden")
        previewContainer.classList.remove("animate__animated", "animate__fadeOut")
      }, 300)

      updateButtonState()
      showTypingIndicator()
      updateStatus("Membaca gambar...", "bg-yellow-500")

      try {
        const captionnya = caption ? caption : "Analisis gambar ini secara lengkap"
        const userID = localStorage.getItem("userID") || generateUserID()
        const response = await AortxAI(
          encodeURIComponent(captionnya),
          userID,
          encodeURIComponent(promptnya),
          imageBuffer,
        )
        removeTypingIndicator()
        updateStatus("Online", "bg-green-500")
        appendMessage("bot", response, true)
      } catch (error) {
        removeTypingIndicator()
        updateStatus("Online", "bg-green-500")
        appendMessage("bot", "Terjadi kesalahan: " + error.message)
      }
    }

    buttonContainer.appendChild(cancelUploadBtn)
    buttonContainer.appendChild(sendImageBtn)

    previewContainer.appendChild(imagePreview)
    previewContainer.appendChild(captionInput)
    previewContainer.appendChild(buttonContainer)

    previewContainer.classList.remove("hidden")
    previewContainer.classList.add("animate__animated", "animate__fadeIn")
  }

  // Show typing indicator with improved styling
  const showTypingIndicator = () => {
    const typingDiv = document.createElement("div")
    typingDiv.id = "typingIndicator"
    typingDiv.className =
      "p-3 my-2 max-w-xs self-start bot-message rounded-lg flex items-center animate__animated animate__fadeIn"
    typingDiv.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>'
    chatBox.appendChild(typingDiv)
    chatBox.scrollTop = chatBox.scrollHeight
  }

  // Remove typing indicator with animation
  const removeTypingIndicator = () => {
    const typingDiv = document.getElementById("typingIndicator")
    if (typingDiv) {
      typingDiv.classList.add("animate__animated", "animate__fadeOut")

      setTimeout(() => {
        if (typingDiv.parentNode) {
          typingDiv.parentNode.removeChild(typingDiv)
        }
      }, 300)
    }
  }

  // Update send button state
  const updateButtonState = () => {
    if (input.value.trim().length > 0) {
      sendBtn.classList.add("active")
      // Add ripple effect
      createRipple(sendBtn, "#6366f1")
    } else {
      sendBtn.classList.remove("active")
    }
  }

  // Create ripple effect for buttons
  const createRipple = (button, color) => {
    const ripple = document.createElement("span")
    ripple.className = "ripple"
    ripple.style.left = "50%"
    ripple.style.top = "50%"
    ripple.style.transform = "translate(-50%, -50%)"
    ripple.style.backgroundColor = color || "rgba(255, 255, 255, 0.4)"

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  // Show notification toast
  const showNotification = (message) => {
    // Remove any existing notification
    const existingNotification = document.querySelector(".notification-toast")
    if (existingNotification) {
      existingNotification.remove()
    }

    const notification = document.createElement("div")
    notification.className =
      "notification-toast fixed top-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate__animated animate__fadeInDown"
    notification.innerHTML = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.remove("animate__fadeInDown")
      notification.classList.add("animate__fadeOutUp")

      setTimeout(() => {
        notification.remove()
      }, 500)
    }, 3000)
  }

  // Event listeners for input
  input.addEventListener("input", updateButtonState)

  sendBtn.onclick = async () => {
    if (!input.value.trim()) return

    // Add ripple effect
    createRipple(sendBtn)

    if (!firstInput) {
      firstInput = true
      updateStatus("Online", "bg-green-500")
    }

    updateStatus("Mengetik...", "bg-yellow-500")
    const userText = input.value.trim()
    input.value = ""
    updateButtonState()
    appendMessage("user", userText)
    showTypingIndicator()

    const userID = localStorage.getItem("userID") || generateUserID()

    try {
      let data
      if (useSearchAPI) {
        const response = await axios.get(
          `https://fastrestapis.fasturl.cloud/aillm/gptsearch?ask=${encodeURIComponent(userText)}&style=${promptnya}&sessionId=${userID}`,
        )
        data = response.data.result
      } else {
        const responsee = await AortxAI(encodeURIComponent(userText), userID, encodeURIComponent(promptnya), null)
        data = responsee
      }

      removeTypingIndicator()
      appendMessage("bot", data, true)
    } catch (error) {
      removeTypingIndicator()
      appendMessage("bot", "Internal server error: " + error.message)
    }

    updateStatus("Online", "bg-green-500")
  }

  input.addEventListener("keydown", (e) => {
    if (!firstInput) {
      firstInput = true
      updateStatus("Online", "bg-green-500")
    }

    if (e.key === "Enter") {
      e.preventDefault()
      sendBtn.click()
    }
  })

  // Generate unique user ID
  function generateUserID() {
    const id = "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

    localStorage.setItem("userID", id)
    return id
  }

  // Options menu handling
  document.getElementById("optionsBtn").addEventListener("click", () => {
    const menu = document.getElementById("optionsMenu")
    menu.classList.toggle("hidden")
    menu.classList.toggle("show")

    // Add ripple effect
    createRipple(document.getElementById("optionsBtn"))
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    const optionsBtn = document.getElementById("optionsBtn")
    const optionsMenu = document.getElementById("optionsMenu")

    if (!optionsBtn.contains(e.target) && !optionsMenu.contains(e.target)) {
      optionsMenu.classList.add("hidden")
      optionsMenu.classList.remove("show")
    }
  })

  // Clear chat with animation
  function clearChat() {
    const chatMessages = chatBox.querySelectorAll("*")

    chatMessages.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("animate__animated", "animate__fadeOutUp")
      }, index * 50)
    })

    setTimeout(
      () => {
        chatBox.innerHTML = ""
        document.getElementById("optionsMenu").classList.add("hidden")
        document.getElementById("optionsMenu").classList.remove("show")

        // Show success notification
        showNotification("Percakapan telah dihapus")
      },
      chatMessages.length * 50 + 300,
    )
  }

  // Theme toggling
  document.getElementById("themeToggle").addEventListener("click", () => {
    const themes = ["indigo", "pink", "emerald"]
    currentTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length]

    // Update theme
    document.querySelectorAll(".theme-indicator").forEach((indicator) => {
      const theme = indicator.getAttribute("data-theme")
      indicator.classList.toggle("pulse-animation", theme === currentTheme)
    })

    // Update send button
    const sendBtn = document.getElementById("sendBtn")
    sendBtn.className = sendBtn.className.replace(/bg-\w+-\d+/g, `bg-${currentTheme}-600`)
    sendBtn.className = sendBtn.className.replace(/hover:bg-\w+-\d+/g, `hover:bg-${currentTheme}-700`)

    // Update UI elements
    document.querySelectorAll(".bot-message").forEach((msg) => {
      msg.style.borderLeftColor = themes[currentTheme].primary
    })

    // Show notification
    showNotification(`Tema ${currentTheme} diaktifkan!`)

    // Close menu
    document.getElementById("optionsMenu").classList.add("hidden")
    document.getElementById("optionsMenu").classList.remove("show")
  })

  // New session functionality
  document.getElementById("newSession").addEventListener("click", () => {
    clearChat()
    localStorage.setItem("userID", generateUserID())

    // Show welcome message after a small delay
    setTimeout(() => {
      appendMessage("bot", "Hai! Sesi baru telah dimulai. Apa yang bisa kubantu hari ini? 😊", true)
    }, 800)
  })

  // Clear chat button event
  document.getElementById("clearChat").addEventListener("click", clearChat)

  // Initialize theme selectors
  document.querySelectorAll(".theme-indicator").forEach((theme) => {
    theme.addEventListener("click", function () {
      currentTheme = this.getAttribute("data-theme")

      // Remove pulse from all indicators
      document.querySelectorAll(".theme-indicator").forEach((t) => {
        t.classList.remove("pulse-animation")
      })

      // Add pulse to selected theme
      this.classList.add("pulse-animation")

      // Update UI with selected theme
      const sendBtn = document.getElementById("sendBtn")
      sendBtn.className = sendBtn.className.replace(/bg-\w+-\d+/g, `bg-${currentTheme}-600`)
      sendBtn.className = sendBtn.className.replace(/hover:bg-\w+-\d+/g, `hover:bg-${currentTheme}-700`)

      // Show notification
      showNotification(`Tema ${currentTheme} diaktifkan!`)
    })
  })

  // Add a welcome message on first load
  setTimeout(() => {
    appendMessage("bot", "Hai! Saya Nevaria AI, asisten pintar kamu. Apa yang bisa saya bantu hari ini? 😊", true)
  }, 1000)
})

