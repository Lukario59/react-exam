import { useState } from 'react'
import { useEffect } from 'react'
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Modal from 'react-modal';
import { Button } from '@mui/material'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function App() {
  const [products, setProducts] = useState([]);
  const [sortProducts, setSortProducts] = useState([]);
  const [sort, setSort] = useState(0);
  const [search, setSearch] = useState("");

  async function getProducts() {
    const response = await fetch("https://reactapi.pautinaweb.ru/objects.php")
    const products = await response.json()
    setProducts(products);
    setSortProducts(products.sort((a, b) => a.price - b.price));
  }
  useEffect(() => {
    getProducts()
  }, [])
  function handleSort(e) {
    setSort(e.target.value)
    if (sort == "1")
      setSortProducts(products.sort((a, b) => b.price - a.price));
    else if (sort == "2")
      setSortProducts(products.sort((a, b) => a.price - b.price));
  }
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    if (search.length != 0)
      setSortProducts(products.filter(e => e.name == search));
    else
      setSortProducts(products);
  }

  return (
    <>
      <header className='header'>
        <input type="text" onChange={e => handleSearch(e)} />
        <button onClick={openModal}>Корзина</button>
      </header>
      <section className="catalog">
        <div className="catalog__filters">
          <h2>Фильтры</h2>
          <select onChange={e => handleSort(e)}>
            <option value="0">Не важно</option>
            <option value="1">По возрастанию</option>
            <option value="2">По убыванию</option>
          </select>
        </div>
        <div className="catalog__wrapper">
          {sortProducts.map((product, key) => {
            return (
              <article key={key} className="product-card">
                <h3 className="product__name">{product.name}</h3>
                <p className="product__price">{product.price}</p>
                <button className="product__btn">
                  Купить
                </button>
              </article>
            )
          })}
        </div>
      </section>
      <section className='slider_section'>
        <h2>Новые товары</h2>
        <Swiper
          modules={[Navigation, Pagination,]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {products.map((product, key) => {
            return (
              <SwiperSlide key={key} >
                <article className="product-card">
                  <h3 className="product__name">{product.name}</h3>
                  <p className="product__price">{product.price}</p>
                  <button className="product__btn" data-id={product.id}>
                    Купить
                  </button>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </section>
      <div className='modal_section'>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Cart Modal"
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Каталог</h2>
          {/* <div className="catalog__wrapper">
              {cartProducts.map((product, key) => {
                return (
                  <article key={key} className="product-card">
                    <img src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" alt="test" className="product__img" />
                    <h3 className="product__name">{product.name}</h3>
                    <p className="product__price">{product.price}</p>
                  </article>
                )
              })}
            </div> */}
          <Button onClick={closeModal} variant="contained">Закрыть окно</Button>
        </Modal>
      </div>
    </>
  )
}

export default App