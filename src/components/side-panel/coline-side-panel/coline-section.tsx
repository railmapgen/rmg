import React from 'react';
import { useAppSelector } from '../../../redux';
import InterchangeCard from '../interchange/interchange-card';
import { useDispatch } from 'react-redux';
import { addColineColor, removeColineColor, updateColineColor } from '../../../redux/param/action';
import { InterchangeInfo } from '../../../constants/constants';

export default function ColineSection() {
    const dispatch = useDispatch();

    const selectedColine = useAppSelector(state => state.app.selectedColine);
    const { coline } = useAppSelector(state => state.param);

    const handleAdd = () => (info: InterchangeInfo) => {
        dispatch(addColineColor(selectedColine, info));
    };

    const handleDelete = () => (i: number) => {
        dispatch(removeColineColor(selectedColine, i));
    };

    const handleUpdate = () => (i: number, info: InterchangeInfo) => {
        dispatch(updateColineColor(selectedColine, i, info));
    };

    // TODO-coline: support mutiple coline color in one segement
    return (
        <InterchangeCard
            interchangeList={coline.at(selectedColine)!.colors}
            onAdd={undefined && handleAdd()}
            onDelete={undefined && handleDelete()}
            onUpdate={handleUpdate()}
        />
    );
}
