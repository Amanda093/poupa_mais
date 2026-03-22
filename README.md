![Logo](public/poupamais.png)

**Poupa+** é um sistema web de gerenciamento financeiro desenvolvido durante o projeto HackaTeen, ao longo de duas semanas, com o apoio da Venturus.

- [**Link do Site**](https://poupa-mais-venturus.vercel.app/)
- [**Documentação**](public/Documentação.pdf)

## 📖 Sumário

- [✨ Sobre o projeto](#-sobre-o-projeto)
- [💻 Tecnologias utilizadas](#-tecnologias-utilizadas)
  - [Front-end](#front-end)
  - [Back-end](#back-end)
  - [Libraries](#libraries)
  - [Frameworks](#frameworks)
  - [Dependências](#dependências)
- [📁 Como executar o projeto](#-Como-executar-o-projeto)
- [📷 Demonstração](#-demonstração)
- [💸 Contribuidores](#-contribuidores)

## ✨ Sobre o projeto

A proposta do Poupa+ é oferecer um **sistema de auxílio financeiro** no qual o usuário informa suas despesas mensais e, com base nesses dados, recebe sugestões personalizadas de planejamento financeiro. As recomendações são geradas por meio da inteligência artificial **[Llama](https://www.llama.com)**, promovendo uma gestão mais consciente e eficiente do dinheiro.

## 💻 Tecnologias utilizadas

### Front-end:

![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-663399?&style=for-the-badge&logo=css&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=gray)
![TS](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### Back-end:

![FIREBASE](https://img.shields.io/badge/FIREBASE-DD2C00?&style=for-the-badge&logo=firebase&logoColor=white)
![CLOUDINARY](https://img.shields.io/badge/Cloudinary-3448C5?&style=for-the-badge&logo=cloudinary&logoColor=white)

### Libraries:

![REACT](https://img.shields.io/badge/REACT-0088CC?&style=for-the-badge&logo=react&logoColor=white)
![SHADCN](https://img.shields.io/badge/SHADCN-000000?&style=for-the-badge&logo=shadcnui&logoColor=white)

### Frameworks:

![NEXT.JS](https://img.shields.io/badge/NEXT.JS-000000?&style=for-the-badge&logo=nextdotjs&logoColor=white)
![TAILWIND](https://img.shields.io/badge/TAILWIND-06B6D4?&style=for-the-badge&logo=tailwindcss&logoColor=white)

### Dependências:

![HUGGINGFACE](https://img.shields.io/badge/hugging_face-FFD21E?&style=for-the-badge&logo=huggingface&logoColor=black)
![AXIOS](https://img.shields.io/badge/axios-5A29E4?&style=for-the-badge&logo=axios&logoColor=white)
![MOTION](https://img.shields.io/badge/motion-FFD21E?&style=for-the-badge&logo=axis&logoColor=white)
![REACTAWESOMEREVEAL](https://img.shields.io/badge/react_awesome_reveal-06B6D4?&style=for-the-badge&logo=react&logoColor=white)
![REACTICONS](https://img.shields.io/badge/ICONS-0088CC?&style=for-the-badge&logo=react&logoColor=white)
![REACTMARKDOWN](https://img.shields.io/badge/REACT_MARKDOWN-000000?&style=for-the-badge&logo=markdown&logoColor=white)
![REACTMARKDOWN](https://img.shields.io/badge/Sweet_alert_2-F7DF1E?&style=for-the-badge&logo=javascript&logoColor=black)

## 📁 Como executar o projeto localmente

**1.** Baixe ou clone o projeto localmente, acesse ele em prompt de comando.

```bash
  # clone o repositório
  git clone https://github.com/Amanda093/poupa_mais
```

**2.** Execute o comando a seguir para a instalação das dependências:

```bash
npm install
```

**3.** Configure o .env definindo as variáveis de desenvolvimento

```tsx
// API KEY da hugging face
HUGGINGFACE_API_KEY=

// Variáveis do Firebase
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

AUTH_COOKIE_NAME=
AUTH_COOKIE_SIGNATURE_KEY_CURRENT=
AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS=

USE_SECURE_COOKIES=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

// Variáveis do Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**4.** Após a instalação, execute um dos comandos a seguir para abrir o projeto:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

**5.** Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📷 Demonstração

**1.** Página Inicial
![Tela-inicial](public/screenshot-principal.png)

**2.** Página de Cadastro
![Tela-de-cadastro](public/screenshot-cadastro.png)

**3.** Página de Login
![Tela-de-login](public/screenshot-login.png)

## 💸 Contribuidores

<div align=center>
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/Amanda093">
          <img src="https://avatars.githubusercontent.com/u/138123400?v=4" width="100px;" alt="Amanda - Github"/><br>
          <sub>
            <b>Amanda</b>
          </sub> <br>
        </a>
        <sub>
            amanda.rocha116@etec.sp.gov.br
          </sub>
      </td>
      </td>
      <td align="center">
        <a href="https://github.com/Apolo-Heh">
          <img src="https://avatars.githubusercontent.com/u/132484542?v=4" width="100px;" alt="Carlos - Github"/><br>
          <sub>
              <b>Carlos</b>
            </sub> <br>
        </a>
        <sub>
            carlos.barile@etec.sp.gov.br
          </sub>
      </td>
      <td align="center">
        <a href="https://github.com/Miguel-Yudi">
          <img src="https://avatars.githubusercontent.com/u/125403398?v=4" width="100px;" alt="Miguel - Github"/><br>
          <sub>
              <b>Miguel</b>
            </sub> <br>
        </a>
        <sub>
            miguel.baba@etec.sp.gov.br
          </sub>
      </td>
      <td align="center">
        <a href="https://github.com/osakirii">
          <img src="https://avatars.githubusercontent.com/u/68735816?v=4" width="100px;" alt="Sakiri - Github"/><br>
          <sub>
              <b>Sakiri</b>
            </sub> <br>
        </a>
        <sub>
            sakiri.cestari@etec.sp.gov.br
          </sub>
      </td>
    </tr>
  </table>
<div>
