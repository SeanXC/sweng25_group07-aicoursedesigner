import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

// mock navigate
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("NavBar component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockedUsedNavigate.mockClear();
  });

  test("shows 'Sign In' when not logged in", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  test("calls navigate to /login when 'Sign In' clicked", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Sign In"));
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");
  });

  test("shows avatar when logged in", () => {
    sessionStorage.setItem("accessToken", "token123");
    sessionStorage.setItem("email", "test@example.com");

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByAltText("User Icon")).toBeInTheDocument();
  });

  test("dropdown opens when avatar clicked", () => {
    sessionStorage.setItem("accessToken", "token123");

    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  test("clicking logo navigates to homepage", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const logo = screen.getByAltText("Logo");
    fireEvent.click(logo);

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
  });
});
