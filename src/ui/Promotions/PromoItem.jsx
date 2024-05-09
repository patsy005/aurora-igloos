/* eslint-disable react/jsx-key */
import { useNavigate, useParams } from 'react-router-dom';
import data from '../../../public/data.json';
import { DeleteIcon, EditIcon, GoBackIcon } from '../Icons';
import SectionHeading from '../SectionHeading';
import IglooItemCard from '../Igloos/IglooItemCard';
import { useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';

function PromoItem() {
    const { promoId } = useParams();
    const igloos = data.igloos;
    const promotions = data.promotions;
    const promotion = data.promotions.find(promo => promo.id === +promoId);
    const navigate = useNavigate();
    const promoIgloos = promotions.find(promo => promo.id === +promoId).iglooId;

    // console.log(promotion.validFrom)
    // const promoDates = {
    //     validFrom: new Date(promotion.validFrom),
    //     validTo: new Date(promotion.validTo)
    // }
    // console.log(promoDates)
    const [dates, setDatesState] = useState([[promotion.validFrom, promotion.validTo]]);

    return (
        <section className="item-section section mt-5">
            <span onClick={() => navigate(-1)} className="go-back">
                <GoBackIcon />
            </span>
            <p className="mt-4"></p>
            <SectionHeading sectionTitle="promotion"></SectionHeading>

            <div className="item-section__overview section-box section-margin flex-md-row">
                {/* <div className="item-img "> */}
                {/* <img src='/images/promo.png' alt='Promotion image' /> */}
                {/* </div> */}
                <div className="item-section__info col-12">
                    <h3 className="item-section__title">{promotion.name}</h3>
                    <div className="item-section__promo">
                        <p className="promo uppercase-text">Description</p>
                        <p className="promo-title mt-2">{promotion.description}</p>
                    </div>
                    <div className="item-section__boxes flex-lg-row gap-lg-5 justify-content-lg-between col-12">
                        <IglooItemCard title="Discount" number={promotion.discount} />
                    </div>

                    <div className="item-section__promo mt-3">
                        <p className="promo uppercase-text">Igloos</p>
                        <div className="item-section__promo--igloos my-3 d-flex gap-5 flex-wrap">
                            {promoIgloos.map(iglooId => {
                                const igloo = igloos.find(igloo => igloo.id === iglooId);
                                return (
                                    <div
                                        className="item-section__promo--igloo-box"
                                        key={igloo.id}
                                        onClick={() => navigate(`/igloo/${iglooId}`)}>
                                        {igloo.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="item-section__availability">
                        <p className="uppercase-text mb-4 mt-3">Availability</p>
                        <div className="col-7 col-lg-5 col-xxl-4">
                            <DatePicker
                                className="custom-calendar"
                                inputClass="input"
                                value={dates[0]}
                                multiple
                                range
                                plugins={[<DatePanel />]}
                                dateSeparator=" - "
                                rangeHover
                                monthYearSeparator="|"
                                portal
                            />
                        </div>
                    </div>

                    <div className="item-section__actions mt-3">
                        <span className="action-icon" onClick={() => navigate(`/promotion/${promoId}/edit`)}>
                            <EditIcon />
                        </span>
                        <span className="action-icon">
                            <DeleteIcon />
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PromoItem;
