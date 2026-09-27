import { Search, ShoppingCart } from 'lucide-react';
import { Icon } from '@pixelforge/icon';
import './index.css';

export const HeaderActions = () => {
    return (
        <section className="header__actions">
            <Icon icon={ Search } size={ 24 } />
            <Icon icon={ ShoppingCart } size={ 24 } />
        </section>
    )
}
