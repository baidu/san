import Category from '../category/model'

interface Todo {
    id: number;
    title: string;
    desc: string;
    endTime: number;
    categoryId: number;
    category?: Category;
    addTime?: number;
    done?: boolean;
}

export default Todo;