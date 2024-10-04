import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MarketPlaceHeader from "../../components/IT22607232_Components/MarketPlaceHeader";
import { addToCart } from "../../redux/IT22607232/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/IT22607232/wishList";
import CountDown from "./CountDown";
import {
  addToRating,
  removeFromRating,
} from "../../redux/IT22607232/ratingSlice";
import { Button, Alert } from "flowbite-react";


export default function MarketPlace() {
  const [resources, setResources] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { rating } = useSelector((state) => state.rating);
  const [reserveMessage, setReserveMessage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch("/api/order/orderListings");
      const data = await res.json();
      setResources(data.listings);
      if (data.listings.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    };
    fetchPost();
  }, []);

  const handleShowMore = async () => {
    const numberOfPosts = resources.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/order/orderListings?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setResources([...resources, ...data.listings]);
      if (data.listings.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };



  // Inside your component
  const handleReserve = async (id) => {
    try {
      const res = await fetch(`/api/order/reserve/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
  
      if (res.ok) {
        // Show success message with toastify
        toast.success("Item reserved successfully!");
  
        // // Redirect to the "Reserved Items" page after 3 seconds
        // setTimeout(() => {
        //   window.location.href = "/reserve/:itemId"; // Update with the correct route for your reserved items page
        // }, 3000);
      } else {
        // Show failure message if reservation fails
        toast.error("Failed to reserve item");
      }
    } catch (error) {
      // Show error message if there is a server issue
      toast.error("An error occurred while reserving the item");
    }
  };
  

  const addToCartHandler = async (id) => {
    const existingItem = cart && cart.find((i) => i._id === id);
    if (existingItem) {
      toast.error("Item already in the cart");
    } else {
      const clickedResource = resources.find((resource) => resource._id === id);
      if (clickedResource.quantity < 1) {
        toast.error("Sorry! The quantity is not available in stock");
      } else {
        const cartData = { ...clickedResource, quantity: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully");
      }
    }
  };

  const removeFromWishListHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data._id));
  };

  const addToWishListHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  useEffect(() => {
    if (
      resources &&
      wishlist &&
      wishlist.find((i) => i._id === resources._id)
    ) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, resources]);

  const handleRatingClick = (value) => {
    if (rating === value) {
      dispatch(removeFromRating());
    } else {
      dispatch(addToRating(value));
    }
  };

  return (
    <>
      <MarketPlaceHeader />
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
          <div className="flex justify-center flex-col flex-1">
            <h2 className="text-2xl font-bold">Samsung S24 Brand New Phone</h2>
            <p className="text-gray-500 my-2">
              {" "}
              Boasting never-seen-before features like circle to search, note
              assist, and live translate, the Galaxy S24 Series promises to take
              your smartphone experience to the next level with the power of
              Galaxy AI! The Galaxy S24 Series is set to launch on 31 January
              2027.
            </p>
            <div className="flex py-2 justify-between">
              <div className="flex">
                <h5 className="font-bold text-[18px] text-slate-800 dark:text-teal-500 font-Roboto">
                  $1000
                </h5>
                <h5 className="font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through">
                  $1200
                </h5>
              </div>
              <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
                120 sold
              </span>
            </div>
            <CountDown />
          </div>
          <div className="flex-1 p-7">
            <img
              src="phone.png"
              alt="phone"
              width={250}
              className="mx-auto rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {resources && resources.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-12">
              {resources.map((resource) => (
                <div key={resource._id}>
                  <div className="group relative w-full border border-teal-500 overflow-hidden rounded-lg sm:w-[330px] transition-all">
                    <Link to={`/sharedResource/${resource.slug}`}>
                      <img
                        src={resource.image}
                        alt="post cover"
                        className="h-[230px] w-full object-cover  transition-all duration-300 z-20"
                      />
                    </Link>
                    <div className="p-3 flex flex-col gap-2">
                      <p className="text-lg font-semibold line-clamp-2">
                        {resource.title}
                      </p>
                      <div className="flex justify-between">
                        <span className="italic text-sm">
                          {resource.category}
                        </span>
                        <div className="flex text-xs">
                          {[...Array(5)].map((star, i) => (
                            <span
                              key={i}
                              onClick={() => handleRatingClick(i + 1)}
                            >
                              {i < rating ? (
                                <AiFillStar
                                  size={20}
                                  className="cursor-pointer text-yellow-300"
                                />
                              ) : (
                                <AiOutlineStar
                                  size={20}
                                  className="cursor-pointer text-gray-500"
                                />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex">
                          <h5 className="font-bold text-[18px] text-slate-800 dark:text-teal-500 font-Roboto">
                            {resource.regularPrice === 0
                              ? resource.regularPrice + " $"
                              : resource.regularPrice -
                                resource.discountPrice +
                                " $" }
                          </h5>
                          <h4 className="font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through">
                            {resource.regularPrice
                              ? resource.regularPrice + " $"
                              : null}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4">
                          {wishlist &&
                          wishlist.find((item) => item._id === resource._id) ? (
                            <AiFillHeart
                              size={22}
                              onClick={() =>
                                removeFromWishListHandler(resource)
                              }
                              className="cursor-pointer text-red-600"
                              title="Remove from wishlist"
                            />
                          ) : (
                            <AiOutlineHeart
                              size={22}
                              onClick={() => addToWishListHandler(resource)}
                              className="cursor-pointer"
                              title="Add to wishlist"
                            />
                          )}
                          <AiOutlineEye
                            size={22}
                            className="cursor-pointer"
                            title="View"
                          />
                          <AiOutlineSearch size={22} className="cursor-pointer" />
                          <AiOutlineShoppingCart
                            size={22}
                            onClick={() => addToCartHandler(resource._id)}
                            className="cursor-pointer"
                            title="Add to cart"
                          />
                          <Button
                            color="success"
                            onClick={() => handleReserve(resource._id)}
                            className="cursor-pointer text-sm"
                            title="Reserve Item"
                          >
                            Reserve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showMore && (
              <div className="flex justify-center">
                <Button onClick={handleShowMore}>Load More</Button>
              </div>
            )}
          </div>
        )}
        {reserveMessage && (
          <Alert color="success">
            {reserveMessage}
          </Alert>
        )}
      </div>
    </>
  );
}
