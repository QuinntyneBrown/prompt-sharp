## 📋 Linear, Step‑by‑Step Plan  
*A single, uninterrupted checklist you can copy‑paste into a terminal or a notes app.*

---

### 0️⃣ Prepare the tooling  
| What you need | How to get it |
|---------------|---------------|
| **Coding agent** (Claude, Codex, GPT‑4‑Turbo, …) | Sign‑up on the provider’s site and get an API key. |
| **Node / .NET SDK** | `brew install node`  /  `winget install Microsoft.DotNet.SDK.8` |
| **Git** | `git --version` – install if missing. |
| **Adobe Color** (optional) | Open <https://color.adobe.com/> in a browser. |

---

### 1️⃣ Install the coding‑agent client (if required)  

```bash
# Example for Anthropic Claude via the CLI
pip install anthropic   # or the appropriate package for your agent
```

---

### 2️⃣ Create the project folder  

```bash
APP_NAME="my‑awesome‑app"           # <- pick a name you like
mkdir $APP_NAME && cd $APP_NAME
git init
```

---

### 3️⃣ Capture the product vision  

```bash
cat > product‑ideas.md <<'EOF'
# Product Ideas – My Awesome App
- Goal: Users can schedule on‑demand tutoring sessions.
- Target users: High‑school students, college undergrads, tutors.
- Core flows:
  - Browse tutor profiles
  - Book a session (calendar + payment)
  - Conduct a video call (WebRTC)
  - Rate & review after the session
- Non‑functional goals:
  - Mobile‑first, fully responsive
  - 99.9 % uptime (auto‑scale)
  - GDPR‑compliant data handling
EOF
```

---

### 4️⃣ Add **technical constraints** (still in `product‑ideas.md`)  

Append the block below (modify to match your stack).

```markdown
## Technical Details
- Architecture: **Clean Architecture** (Domain, Application, Infrastructure, Presentation)
- UI methodology: **Atomic Design**
- Front‑end: **Blazor** + **MatBlazor** (or React + native custom elements)
- Back‑end: **.NET 8**, **EF Core**, **SQL Server**, **OAuth 2** (IdentityServer4 / Azure AD)
- Responsiveness: CSS Grid/Flexbox, mobile‑first breakpoints
- Accessibility: WCAG 2.1 AA, ARIA, keyboard navigation
- Testing: xUnit (backend), Playwright (UI), unit tests for atoms/molecules
- CI/CD: GitHub Actions or Azure Pipelines
```

Commit the file (good practice).

```bash
git add product-ideas.md && git commit -m "Add product vision + technical constraints"
```

---

### 5️⃣ Ask the agent to **list required screens**  

**Prompt template (copy‑paste into your agent UI or CLI):**

```
Based on the product ideas in product-ideas.md, list every UI screen we’ll need.
For each screen, give a one‑sentence purpose.
Return a plain‑text bullet list.
```

*Save the answer as* `screens-list.md` *(optional but helpful).*

---

### 6️⃣ Pick the **most complex screen**  

Open `screens-list.md`, identify the screen with the richest interactions (e.g., **“Book a Session”**).

---

### 7️⃣ Generate a **high‑fidelity skeleton** for that screen  

**Prompt template:**

```
Create a responsive UI skeleton for the "Book a Session" screen.
- Use native custom elements (or React if you prefer).
- Apply a colour palette from https://color.adobe.com/ (pick any you like).
- Follow Atomic Design: start with atoms → molecules → organisms.
- Do not oversimplify; aim for a professional‑grade layout.
```

**Save the output** to the appropriate source file, e.g.:

```bash
mkdir -p src/pages
cat > src/pages/BookSession.skeleton.html <<'HTML'
...generated markup...
HTML
```

*(If you’re using Blazor, name it `BookSession.razor`.)*

---

### 8️⃣ Refine the skeleton – **11‑star UX**  

Run **10 iterative reviews**. For each iteration, feed the current markup back to the agent.

**Iteration prompt (repeat 10× or until satisfied):**

```
Review the attached skeleton and improve it according to Airbnb’s 11‑star framework:
1. Reduce visual clutter
2. Add subtle micro‑interactions
3. Strengthen hierarchy & affordances
4. Ensure keyboard & screen‑reader accessibility
5. Polish spacing, typography, colour contrast
Give only the revised markup (no explanation) and a brief "what changed?" note.
```

Replace the file with the revised markup after each round.

---

### 9️⃣ **Repeat steps 6‑8** for every remaining screen  

1. Choose the next screen (any order works).  
2. Ask the agent for its skeleton.  
3. Refine it through the 11‑star loop.  
4. Store each file under `src/pages/…`.

When you finish, you have a **complete set of polished UI skeletons**.

---

### 10️⃣ Plan & Build the **backend**  

Create `backend-plan.md` with the outline below (feel free to edit).

```markdown
# Backend Plan

## 1️⃣ Architecture
- Clean Architecture: Domain, Application, Infrastructure, Presentation layers.

## 2️⃣ Domain Model
- Entities: User, Tutor, Session, Rating, Payment.
- Value Objects: Money, Email, PhoneNumber, TimeSlot.

## 3️⃣ Application Use‑Cases
- ScheduleSession
- CancelSession
- SubmitRating
- ProcessPayment
- Authenticate (OAuth2)

## 4️⃣ Infrastructure
- EF Core DbContext → SQL Server
- Repositories (generic + specific)
- External adapters: OAuth2 provider, payment gateway (Stripe), email service

## 5️⃣ Presentation
- Minimal API endpoints (or gRPC) for each use‑case.
- JWT bearer authentication (OAuth2).

## 6️⃣ Cross‑cutting concerns
- Logging (Serilog)
- Telemetry (Application Insights)
- Global exception handling
- Unit tests (xUnit + Moq)

## 7️⃣ CI/CD
- GitHub Actions: build → test → publish Docker image → Azure Web App.
```

**Implementation steps (run them one after another):**

```bash
# Scaffold a Clean Architecture solution (using a community template)
dotnet new sln -n $APP_NAME
dotnet new classlib -o src/Domain
dotnet new classlib -o src/Application
dotnet new classlib -o src/Infrastructure
dotnet new webapi -o src/Presentation

# Add projects to the solution
dotnet sln add src/Domain/src/Domain.csproj
dotnet sln add src/Application/src/Application.csproj
dotnet sln add src/Infrastructure/src/Infrastructure.csproj
dotnet sln add src/Presentation/src/Presentation.csproj

# Wire up project references
dotnet add src/Application/src/Application.csproj reference src/Domain/src/Domain.csproj
dotnet add src/Infrastructure/src/Infrastructure.csproj reference src/Application/src/Application.csproj src/Domain/src/Domain.csproj
dotnet add src/Presentation/src/Presentation.csproj reference src/Application/src/Application.csproj src/Infrastructure/src/Infrastructure.csproj src/Domain/src/Domain.csproj

# Add EF Core packages
dotnet add src/Infrastructure/src/Infrastructure.csproj package Microsoft.EntityFrameworkCore.SqlServer
dotnet add src/Infrastructure/src/Infrastructure.csproj package Microsoft.EntityFrameworkCore.Tools

# Add OAuth2 authentication packages
dotnet add src/Presentation/src/Presentation.csproj package Microsoft.AspNetCore.Authentication.JwtBearer

# Create initial migration and update DB
dotnet ef migrations add InitialCreate -p src/Infrastructure/src/Infrastructure.csproj -s src/Presentation/src/Presentation.csproj
dotnet ef database update -p src/Infrastructure/src/Infrastructure.csproj -s src/Presentation/src/Presentation.csproj
```

Run tests and start the API:

```bash
dotnet test   # all projects
dotnet run --project src/Presentation/src/Presentation.csproj
```

---

### 11️⃣ Plan & Build the **frontend**  

Create `frontend-plan.md` (example content).

```markdown
# Frontend Plan

## 1️⃣ Folder structure (Atomic Design)
src/
 ├─ Atoms/
 ├─ Molecules/
 ├─ Organisms/
 ├─ Templates/
 └─ Pages/

## 2️⃣ Convert skeletons → Blazor components
- Each HTML snippet becomes a Razor component.
- Re‑use Atoms (Button, Input, Icon) across Molecules.

## 3️⃣ State management
- Use Fluxor (Redux‑style) or built‑in `IState` for UI state.

## 4️⃣ API integration
- Register `HttpClientFactory` with base address of the backend.
- Create typed clients (`ISessionApi`, `ITutorApi`).

## 5️⃣ UI library
- Add MatBlazor for data‑grids, dialogs, toast notifications.

## 6️⃣ Responsiveness & testing
- Verify breakpoints (mobile < 600 px, tablet 600‑1024 px, desktop >1024 px).
- Write Playwright tests for each page.

## 7️⃣ CI/CD
- GitHub Actions: restore → build → test → publish to Azure Static Web Apps.
```

**Implementation steps (run in the project root):**

```bash
# Create the Blazor WebAssembly project
dotnet new blazorwasm -o src/Frontend --no-https

# Add MatBlazor UI library
dotnet add src/Frontend/src/Frontend.csproj package MatBlazor

# Add Fluxor (optional state management)
dotnet add src/Frontend/src/Frontend.csproj package Fluxor.Blazor.Web

# Create the Atomic Design folders
mkdir -p src/Frontend/Atoms src/Frontend/Molecules src/Frontend/Organisms src/Frontend/Templates src/Frontend/Pages

# Example: turn the BookSession skeleton into a component
cp src/pages/BookSession.skeleton.html src/Frontend/Pages/BookSession.razor
# (Open the .razor file and replace plain HTML with Blazor syntax,
#   inject services, bind to models, etc.)

# Build, test, run
dotnet build src/Frontend/src/Frontend.csproj
dotnet test src/Frontend/tests/Frontend.Tests.csproj   # if you added tests
dotnet run --project src/Frontend/src/Frontend.csproj
```

---

### 12️⃣ **Test, CI/CD, Deploy**  

**GitHub Actions workflow (simplified)** – place in `.github/workflows/ci.yml`:

```yaml
name: CI / CD

on:
  push:
    branches: [ main ]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.x'
      - name: Restore & Build
        run: dotnet restore && dotnet build --configuration Release
      - name: Run tests
        run: dotnet test --no-build --verbosity normal

  publish-backend:
    needs: build-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Publish API
        run: |
          dotnet publish src/Presentation/src/Presentation.csproj -c Release -o out/api
      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: my-awesome-api
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: out/api

  publish-frontend:
    needs: build-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Publish Blazor
        run: |
          dotnet publish src/Frontend/src/Frontend.csproj -c Release -o out/frontend
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "out/frontend"
```

Push your code; the pipeline builds, tests, and deploys automatically.

---

## 🎉 All Done!  

Follow the checklist **exactly in order**, pausing only when you need to edit a prompt or verify a generated file. By the end you’ll have:

1. A **clear product vision** written in markdown.  
2. A **complete set of polished UI skeletons** (11‑star quality).  
3. A **backend** built on Clean Architecture, .NET 8, EF Core, OAuth 2.  
4. A **frontend** built with Blazor, Atomic Design, MatBlazor, and fully responsive.  
5. **Automated tests**, CI/CD, and a live deployment.
