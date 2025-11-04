    import { create } from 'zustand';

    const useFilterStore = create((set) => ({
        collectionId: '',
        minPrice: '',
        maxPrice: '',
        sortBy: '',

        setCollectionId: (collectionId) => set({ collectionId }),
        setMinPrice: (minPrice) => set({ minPrice }),
        setMaxPrice: (maxPrice) => set({ maxPrice }),
        setSortBy: (sortBy) => set({ sortBy }),
    }));

    export default useFilterStore;
