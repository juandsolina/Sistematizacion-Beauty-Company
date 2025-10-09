import { useEffect } from "react";
import { Link } from "react-router-dom";

// IMÁGENES DESDE src/assets (Home.tsx está en src/pages)
import logo from "../assets/Logotienda.png";
import horario from "../assets/horario.png";
import ubicacion from "../assets/ubicacion.png";
import contacto from "../assets/contacto.png";
import manos from "../assets/Manos.png";
import toallitas from "../assets/Toallitas.png";
// si el archivo tiene espacio en el nombre, usa exactamente ese nombre:
import ollita from "../assets/ollita-de-cera.png";
import pulidor from "../assets/pulidor.png";
import cuellero from "../assets/Cuellero.png";

export default function Home() {
  useEffect(() => {
    const menuIcon = document.getElementById("menu-icon");
    const navlist = document.querySelector(".navlist");
    if (menuIcon && navlist) {
      menuIcon.addEventListener("click", () => navlist.classList.toggle("active"));
    }
    const header = document.querySelector("header");
    const onScroll = () => header?.classList.toggle("sticky", window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Home Section */}
      <section className="home" id="home">
        <div className="home-text">
          <h1>
            El <span>encanto</span> <br /> comienza <br /> en tus manos
          </h1>
          <Link to="/catalogo" className="btn">
            Explorar catálogo <i className="bx bxs-right-arrow"></i>
          </Link>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleScroll("contact");
            }}
            className="btn2"
          >
            Ordenar ahora
          </a>
        </div>

        <div className="home-img">
          <img src={logo} alt="Logo Susana Tienda" />
        </div>
      </section>

      {/* Container Section */}
      <section className="px-8 md:px-16 py-16">
        <div className="cards-grid">
          <div className="container-box">
            <img src={horario} alt="Horario" />
            <h3>10:00 am - 7:00 pm</h3>
            <span className="text-pink-500">Horario</span>
          </div>

          <div className="container-box">
            <img src={ubicacion} alt="Ubicación" />
            <h3>SusanatiendaBogotá</h3>
            <a
              href="https://www.google.com/maps/place/Centro+Comercial+Mediterraneo/@4.61636,-74.1057048,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f9942de630bf7:0x6ce2fe1161e66e56!8m2!3d4.61636!4d-74.1031299!16s%2Fg%2F11bychlxpd?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
            >
              Dirección
            </a>
          </div>

          <div className="container-box">
            <img src={contacto} alt="Contacto" />
            <h3>(+57) 320-8070082</h3>
            <a
              href="https://api.whatsapp.com/send?phone=573208070082&text=Quiero+informaci%C3%B3n+sobre..."
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-img">
          <img src={manos} alt="Manos perfectas" />
        </div>

        <div className="about-text">
          <h2>
            Descubre la Magia <br /> de unas Uñas Perfectas <br /> en SusanaTiendaBogotá
          </h2>
          <p>
            SusanaTiendaBogotá es una tienda especializada en productos de belleza para uñas, ofreciendo una amplia
            variedad de artículos de alta calidad para el cuidado y embellecimiento de las uñas. Con un enfoque en
            brindar atención personalizada y un excelente servicio al cliente, SusanaTiendaBogotá se dedica a satisfacer
            las necesidades de cada persona, proporcionando productos que destacan por su durabilidad y diseño. Ya sea
            que busques productos profesionales o simplemente quieras consentirte, en nuestra tienda encontrarás todo lo
            que necesitas para lucir unas uñas perfectas.
          </p>
          <a
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              handleScroll("shop");
            }}
            className="btn"
          >
            Explorar historia<i className="bx bxs-right-arrow"></i>
          </a>
        </div>
      </section>

      {/* Shop Section */}
      <section className="shop" id="shop">
        <div className="middle-text">
          <h4>Nuestra tienda</h4>
          <h2>Productos populares</h2>
        </div>

        <div className="shop-content">
          <div className="row">
            <img src={toallitas} alt="Toallitas uñas" />
            <h3>Toallitas uñas</h3>
            <p>
              Toallitas de uñas hechas de tela no tejida, suave y sin pelusas, no dejan desprendimiento de fibras,
              funciona con removedor de esmalte de uñas.
            </p>
            <div className="in-text">
              <div className="price">
                <h6>$6000</h6>
              </div>
              <div className="s-btn">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll("contact");
                  }}
                >
                  Ordenar ahora
                </a>
              </div>
            </div>
            <div className="top-icon">
              <button>
                <i className="bx bx-heart"></i>
              </button>
            </div>
          </div>

          <div className="row">
            <img src={ollita} alt="Ollita de cera" />
            <h3>Ollita de cera</h3>
            <p>Olla calentadora de cera siliconada, plegable, súper fácil de limpiar inmediatamente después de su uso.</p>
            <div className="in-text">
              <div className="price">
                <h6>$35000</h6>
              </div>
              <div className="s-btn">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll("contact");
                  }}
                >
                  Ordenar ahora
                </a>
              </div>
            </div>
            <div className="top-icon">
              <button>
                <i className="bx bx-heart"></i>
              </button>
            </div>
          </div>

          <div className="row">
            <img src={pulidor} alt="Pulidor de mesa" />
            <h3>Pulidor de mesa</h3>
            <p>
              Pulidora de uñas profesional de 35.000 RPM de potencia, cumple con múltiples manicuras desde un simple
              recorte hasta pulir uñas.
            </p>
            <div className="in-text">
              <div className="price">
                <h6>$100000</h6>
              </div>
              <div className="s-btn">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll("contact");
                  }}
                >
                  Ordenar ahora
                </a>
              </div>
            </div>
            <div className="top-icon">
              <button>
                <i className="bx bx-heart"></i>
              </button>
            </div>
          </div>

          <div className="row">
            <img src={cuellero} alt="Papel Cuellero" />
            <h3>Papel Cuellero</h3>
            <p>Tira de papel desechable para cuello, accesorio elástico profesional para peluquería.</p>
            <div className="in-text">
              <div className="price">
                <h6>$11000</h6>
              </div>
              <div className="s-btn">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll("contact");
                  }}
                >
                  Ordenar ahora
                </a>
              </div>
            </div>
            <div className="top-icon">
              <button>
                <i className="bx bx-heart"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="row-btn">
          <Link to="/catalogo" className="btn">
            Catálogo<i className="bx bxs-right-arrow"></i>
          </Link>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews" id="reviews">
        <div className="middle-text">
          <h4>Nuestros clientes</h4>
          <h2>Reseña de clientes sobre nuestros productos</h2>
        </div>
      </section>

      <section className="reviews-content">
        {["Felipe Arévalo", "Juan Solina", "Cristian Molina"].map((name, i) => (
          <div key={i} className="box">
            <p className="text-gray-300 mb-6 italic">"Excelente calidad y servicio. ¡Recomendados!"</p>
            <div className="in-box">
              {/* avatar simple sin imagen rota */}
              <div className="bx-img">
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#e91e63" }} />
              </div>
              <div className="bxx-text">
                <h4>{name}</h4>
                <h5>Cliente</h5>
                <div className="ratings">
                  {[...Array(5)].map((_, j) => (
                    <i key={j} className="bx bxs-star"></i>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="contact-content">
          <div className="contact-text">
            <h2>Contáctanos</h2>
            <p>
              ¡Estamos aquí para ayudarte! En SusanaTiendaBogotá nos importa ofrecerte el mejor servicio. Si tienes
              alguna duda, pregunta o sugerencia, no dudes en ponerte en contacto con nosotros. Puedes llamarnos al +57
              3208070082 o visitarnos en Cl. 9, #38-50, San Andresito de la 38 centro comercial mediterranee segundo
              piso. También puedes seguirnos en nuestras redes sociales para estar al tanto de nuestras últimas
              novedades ¡Gracias por elegirnos, esperamos saber de ti pronto!
            </p>
            <div className="social">
              <a
                href="https://www.instagram.com/susanatiendabogota/"
                className="clr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-instagram-alt"></i>
              </a>
              <a
                href="https://www.facebook.com/groups/104687760366397/user/100035556932131/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-facebook"></i>
              </a>
              <a href="https://www.tiktok.com/@susanatiendabta" target="_blank" rel="noopener noreferrer">
                <i className="bx bxl-tiktok"></i>
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=573208070082&text=Quiero+informaci%C3%B3n+sobre..."
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="details">
            <div className="main-d">
              <a
                href="https://www.google.com/maps/place/Centro+Comercial+Mediterraneo/@4.61636,-74.1057048,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f9942de630bf7:0x6ce2fe1161e66e56!8m2!3d4.61636!4d-74.1031299!16s%2Fg%2F11bychlxpd?hl=es"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxs-location-plus"></i>Cl. 9 #3850, Bogotá
              </a>
            </div>
            <div className="main-d">
              <a
                href="https://api.whatsapp.com/send?phone=573208070082&text=Quiero+informaci%C3%B3n+sobre..."
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bx-mobile-alt"></i>+57 3208070082
              </a>
            </div>
            <div className="main-d">
              <a href="https://www.instagram.com/susanatiendabogota/" target="_blank" rel="noopener noreferrer">
                <i className="bx bxl-instagram-alt"></i>SusanatiendaBogotá
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          handleScroll("home");
        }}
        className="scroll"
      >
        <i className="bx bx-up-arrow-alt"></i>
      </a>
    </>
  );
}
